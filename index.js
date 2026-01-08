require('dotenv').config()
const express = require('express')
const http = require('http')
const mysql = require('mysql2')
const { Server } = require('socket.io')
const session = require('express-session')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const bcrypt = require('bcrypt')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "*", credentials: true }
})

// In-memory map to hold per-tab sessions (tabToken -> user)
const tabSessions = new Map()

/* ================= MIDDLEWARE ================= */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  name: 'fannyfa.sid',
  secret: process.env.SESSION_SECRET || 'fannyfa_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

/* ================= DATABASE ================= */
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

db.connect(err => {
  if (err) {
    console.error('[DB ERROR]', err)
    process.exit(1)
  }
  console.log('[DB CONNECTED]')
})

/* ================= AUTH MIDDLEWARE ================= */
function isLogin(req, res, next) {
  const user = req.user || req.session.user
  if (!user) return res.redirect('/login')
  req.user = user
  next()
}

function isAdmin(req, res, next) {
  const user = req.user || req.session.user
  if (user && user.role === 'admin') {
    req.user = user
    return next()
  }
  return res.redirect('/dashboard')
}

// Attach per-tab user (if any) to each request before routes
app.use((req, res, next) => {
  // get tab token from header, query or cookie
  let tabToken = req.get('x-tab-token') || req.query.tabToken
  if (!tabToken && req.headers.cookie) {
    const m = req.headers.cookie.match(/(?:^|; )tabToken=([^;]+)/)
    if (m) tabToken = decodeURIComponent(m[1])
  }
  if (tabToken && tabSessions.has(tabToken)) {
    req.user = tabSessions.get(tabToken)
  }
  next()
})

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads')
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uid = (req.user && req.user.id) || (req.session.user && req.session.user.id)
    cb(null, `avatar_${uid}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Avatar harus gambar'))
  }
})

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads')
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `product_${Date.now()}${ext}`)
  }
})

const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) cb(null, true)
    else cb(new Error('File harus gambar atau video'))
  }
})
/* ================= ROUTES ================= */
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
)

app.get('/login', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/login.html'))
)

app.get('/register', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/register.html'))
)

app.get('/dashboard', isLogin, (req, res) =>
  res.sendFile(path.join(__dirname, 'public/dashboard.html'))
)

app.get('/profile', isLogin, (req, res) =>
  res.sendFile(path.join(__dirname, 'public/profile.html'))
)

app.get('/admin', isAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin.html'))
)

app.get('/cart', isLogin, (req, res) =>
  res.sendFile(path.join(__dirname, 'public/cart.html'))
)

app.get('/edit', isAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, 'public/edit.html'))
)

app.get('/upload', isAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, 'public/upload.html'))
)

app.get('/product.html', isLogin, (req, res) =>
  res.sendFile(path.join(__dirname, 'public/product.html'))
)

app.get('/logout', (req, res) => {
  let tabToken = req.get('x-tab-token') || req.query.tabToken
  if (!tabToken && req.headers.cookie) {
    const m = req.headers.cookie.match(/(?:^|; )tabToken=([^;]+)/)
    if (m) tabToken = decodeURIComponent(m[1])
  }

  if (tabToken && tabSessions.has(tabToken)) {
    tabSessions.delete(tabToken)
    res.clearCookie && res.clearCookie('tabToken')
    return res.redirect('/')
  }

  req.session.destroy(() => {
    res.clearCookie && res.clearCookie('tabToken')
    res.redirect('/')
  })
})

app.get('/chatai', isLogin, (req, res) =>
  res.sendFile(path.join(__dirname, 'public/chatai.html'))
)
/* ================= AUTH API ================= */
app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body

  const [rows] = await db.promise().query(
    'SELECT * FROM users WHERE username=? OR email=?',
    [usernameOrEmail, usernameOrEmail]
  )

  if (!rows.length) return res.json({ success: false, message: 'Username atau password salah' })

  const user = rows[0]

  let match = false
  const stored = user.password || ''
  if (stored.startsWith('$2')) {
    match = await bcrypt.compare(password, stored)
  } else {
    // legacy plaintext password in DB
    if (password === stored) {
      // re-hash and update to bcrypt
      try {
        const newHash = await bcrypt.hash(password, 10)
        await db.promise().query('UPDATE users SET password=? WHERE id=?', [newHash, user.id])
      } catch (e) {
        console.error('Failed to re-hash password:', e)
      }
      match = true
    }
  }

  if (!match) return res.json({ success: false, message: 'Username atau password salah' })

  const userObj = {
    id: user.id,
    username: user.username,
    role: user.role,
    avatar: user.avatar
  }

  const tabToken = req.get('x-tab-token') || req.body.tabToken
  if (tabToken) {
    tabSessions.set(tabToken, userObj)
  } else {
    req.session.user = userObj
  }

  // jika login lewat tab (fetch dengan header x-tab-token), sertakan tabToken di redirect
  let redirectUrl = rows[0].role === 'admin' ? '/admin' : '/dashboard'
  if (tabToken) {
    redirectUrl = `${redirectUrl}?tabToken=${encodeURIComponent(tabToken)}`
  }

  res.json({ success: true, redirectUrl })
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  const hashed = await bcrypt.hash(password, 10)
  await db.promise().query(
    'INSERT INTO users (username,password,role) VALUES (?,?,?)',
    [username, hashed, 'user']
  )

  sendDashboardToAll()
  res.json({ success: true })
})

/* ================= COMMENTS API ================= */
// Ambil semua komentar sebuah produk
app.get('/api/comments/:id', async (req,res)=>{
  const [rows] = await db.promise().query(`
    SELECT 
      c.id,
      c.text,
      c.created_at,
      c.user_id,
      c.parent_id,
      u.username,
      u.avatar
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.product_id = ?
    ORDER BY c.id DESC
  `,[req.params.id]);

  res.json(rows);
})

// === NEW FEATURE ===
// Tambah komentar baru & reply, realtime socket
app.post('/api/comments', isLogin, async (req,res)=>{
  const { productId, text, parentId } = req.body;
  const userId = (req.user && req.user.id) || (req.session.user && req.session.user.id);

  const [result] = await db.promise().query(
    'INSERT INTO comments (product_id,user_id,text,parent_id) VALUES (?,?,?,?)',
    [productId,userId,text,parentId||null]
  );

  // Ambil username & avatar
  const [[user]] = await db.promise().query(
    'SELECT username, avatar FROM users WHERE id=?',
    [userId]
  );

  const newComment = {
    id: result.insertId,
    product_id: productId,
    username: user.username,
    avatar: user.avatar,
    text,
    parent_id: parentId||null,
    created_at: new Date(),
    likes: 0
  };

  io.emit('new-comment', newComment);
  res.json({ success:true });
})

// === NEW FEATURE ===
// Like komentar
app.post('/api/comments', isLogin, async (req,res)=>{
  const { productId, text, parentId } = req.body;
  const userId = (req.user && req.user.id) || (req.session.user && req.session.user.id);

  const [result] = await db.promise().query(
    'INSERT INTO comments (product_id,user_id,text,parent_id) VALUES (?,?,?,?)',
    [productId,userId,text,parentId||null]
  );

  const [[user]] = await db.promise().query(
    'SELECT username, avatar FROM users WHERE id=?',
    [userId]
  );

  const newComment = {
    id: result.insertId,
    product_id: productId,
    username: user.username,
    avatar: user.avatar,
    text,
    parent_id: parentId||null,
    created_at: new Date(),
    likes: 0
  };

  // emit ke room produk
  io.to(`product_${productId}`).emit('new-comment', newComment);
  res.json({ success:true });
});

app.post('/api/comments/like/:id', isLogin, async (req,res)=>{
  const commentId = req.params.id;
  const userId = (req.user && req.user.id) || (req.session.user && req.session.user.id);

  const [[like]] = await db.promise().query(
    'SELECT * FROM comment_likes WHERE comment_id=? AND user_id=?',
    [commentId,userId]
  );

  if(like){
    await db.promise().query(
      'DELETE FROM comment_likes WHERE comment_id=? AND user_id=?',
      [commentId,userId]
    );
  } else {
    await db.promise().query(
      'INSERT INTO comment_likes (comment_id,user_id) VALUES (?,?)',
      [commentId,userId]
    );
  }

  const [totalLikes] = await db.promise().query(
    'SELECT COUNT(*) total FROM comment_likes WHERE comment_id=?',
    [commentId]
  );

  // emit ke room produk
  const [[comment]] = await db.promise().query(
    'SELECT product_id FROM comments WHERE id=?', [commentId]
  );

  io.to(`product_${comment.product_id}`).emit('comment-liked', { 
    commentId, totalLikes: totalLikes[0].total 
  });

  res.json({ success:true });
});

// Socket connection
io.on('connection', socket => {
  // join room produk
  socket.on('join-product', productId => {
    socket.join(`product_${productId}`);
  });
});

/* ================= PROFILE API ================= */
app.get('/api/me', (req, res) => {
  const user = req.user || req.session.user
  if (!user) return res.json({ login: false })
  res.json({ login: true, ...user })
})

app.put('/api/profile', isLogin, upload.single('avatar'), async (req, res) => {
  const { mode, username, password, oldPassword } = req.body
  const user = req.user || req.session.user
  const id = user.id
  const avatar = req.file ? req.file.filename : null

  if (mode === 'profile') {
    if (!username) return res.json({ success:false, message:'Username wajib diisi' })

    let sql = 'UPDATE users SET username=?'
    let params = [username]

    if (avatar){
      sql += ', avatar=?'
      params.push(avatar)
      if (req.user) {
        // update in-memory tab session
        const tabToken = req.get('x-tab-token') || req.body.tabToken
        if (tabToken && tabSessions.has(tabToken)) {
          const u = tabSessions.get(tabToken)
          u.avatar = avatar
          tabSessions.set(tabToken, u)
        }
      } else {
        req.session.user.avatar = avatar
      }
    }

    sql += ' WHERE id=?'
    params.push(id)

    await db.promise().query(sql, params)
    if (req.user) {
      const tabToken = req.get('x-tab-token') || req.body.tabToken
      if (tabToken && tabSessions.has(tabToken)) {
        const u = tabSessions.get(tabToken)
        u.username = username
        tabSessions.set(tabToken, u)
      }
    } else {
      req.session.user.username = username
    }
    return res.json({ success:true })
  }

  if (mode === 'password'){
    if(!oldPassword||!password) return res.json({ success:false, message:'Lengkapi data password' })

    if(password.length<6) return res.json({ success:false, message:'Password baru minimal 6 karakter' })

    const [rows] = await db.promise().query('SELECT password FROM users WHERE id=?',[id])
    if(!rows.length) return res.json({ success:false, message:'Password lama salah' })

    const match = await bcrypt.compare(oldPassword, rows[0].password)
    if(!match) return res.json({ success:false, message:'Password lama salah' })

    const newHash = await bcrypt.hash(password, 10)
    await db.promise().query('UPDATE users SET password=? WHERE id=?',[newHash,id])
    return res.json({ success:true })
  }

  res.json({ success:false, message:'Mode tidak valid' })
})

/* ================= ITEMS ================= */
app.get('/api/items', async (req, res) => {
  const [rows] = await db.promise().query(
    'SELECT *, created_at FROM items ORDER BY created_at DESC'
  )
  res.json(rows)
})

/* ================= ADMIN ITEMS ================= */
app.get('/admin/items', isAdmin, async (req, res) => {
  const [rows] = await db.promise().query('SELECT * FROM items')
  res.json(rows)
})

app.post('/admin/items', isAdmin, uploadProduct.single('media'), async (req, res) => {
  const { name, price, description } = req.body
  const media = req.file ? req.file.filename : null

  await db.promise().query(
    'INSERT INTO items (name,price,description,media) VALUES (?,?,?,?)',
    [name, price, description, media]
  )

  res.json({ success: true })
})

app.put('/admin/items/:id', isAdmin, uploadProduct.single('media'), async (req, res) => {
  const { name, price, description } = req.body
  const media = req.file ? req.file.filename : null

  let sql = 'UPDATE items SET name=?, price=?, description=?'
  let params = [name, price, description]

  if (media) {
    sql += ', media=?'
    params.push(media)
  }

  sql += ' WHERE id=?'
  params.push(req.params.id)

  await db.promise().query(sql, params)
  res.json({ success: true })
})

app.delete('/admin/items/:id', isAdmin, async (req, res) => {
  await db.promise().query('DELETE FROM items WHERE id=?', [req.params.id])
  res.json({ success: true })
})

/* ================= CART ================= */
app.post('/api/cart', isLogin, async (req, res) => {
  const { itemId, qty } = req.body
  const userId = (req.user && req.user.id) || (req.session.user && req.session.user.id)

  let [cart] = await db.promise().query(
    'SELECT id FROM carts WHERE user_id=?',
    [userId]
  )

  let cartId = cart.length
    ? cart[0].id
    : (await db.promise().query(
        'INSERT INTO carts (user_id) VALUES (?)',
        [userId]
      ))[0].insertId

  await db.promise().query(
    `INSERT INTO cart_items (cart_id,item_id,quantity)
     VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE quantity=quantity+?`,
   
     [cartId, itemId, qty, qty]
  )

  res.json({ success: true })
})

app.get('/api/cart', isLogin, async (req, res) => {
  const userId = (req.user && req.user.id) || (req.session.user && req.session.user.id)

  const [rows] = await db.promise().query(`
    SELECT ci.id, i.name, i.price, i.media, ci.quantity
    FROM carts c
    JOIN cart_items ci ON ci.cart_id=c.id
    JOIN items i ON i.id=ci.item_id
    WHERE c.user_id=?
  `, [userId])

  res.json(rows)
})

app.delete('/api/cart/:id', isLogin, async (req, res) => {
  await db.promise().query(
    'DELETE FROM cart_items WHERE id=?',
    [req.params.id]
  )
  res.json({ success: true })
})
// API untuk ambil total like tiap komentar produk
app.get('/api/comments/likes/:productId', async (req, res) => {
  const [rows] = await db.promise().query(`
    SELECT c.id AS comment_id, COUNT(cl.id) AS total
    FROM comments c
    LEFT JOIN comment_likes cl ON cl.comment_id=c.id
    WHERE c.product_id=?
    GROUP BY c.id
  `, [req.params.productId]);
  res.json(rows);
});

/* ================= REALTIME DASHBOARD ================= */
function getDashboardData(cb) {
  const data = {}

  db.query(`SELECT COUNT(*) total FROM users`, (_, r) => {
    data.totalUsers = r[0].total

    db.query(`SELECT COUNT(*) total FROM users WHERE role='user'`, (_, r) => {
      data.roleUser = r[0].total

      db.query(`SELECT COUNT(*) total FROM users WHERE role='admin'`, (_, r) => {
        data.roleAdmin = r[0].total
        cb(data)
      })
    })
  })
}

function sendDashboardToAll() {
  getDashboardData(data => io.emit('dashboard:update', data))
}

io.on('connection', socket => {
  getDashboardData(data => socket.emit('dashboard:update', data))
})

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

module.exports = app;
/* ================= SERVER ================= */
server.listen(3000, () => {
  console.log('[SERVER] http://localhost:3000')
})