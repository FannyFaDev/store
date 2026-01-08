require('dotenv').config()
const express = require('express')
const http = require('http')
const mysql = require('mysql2')
const { Server } = require('socket.io')
const session = require('express-session')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const jwt = require('jsonwebtoken')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "*", credentials: true }
})

const JWT_SECRET = process.env.JWT_SECRET || 'fannyfa_jwt_secret'

/* ================= MIDDLEWARE ================= */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// session masih dipakai untuk route non multi-tab
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

/* ================= JWT / ROLE ================= */
// generate token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  )
}

// middleware cek token & role
function authRole(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.status(401).json({ message: 'Token tidak ada' })

    const token = authHeader.split(' ')[1] // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Token kosong' })

    try {
      const payload = jwt.verify(token, JWT_SECRET)
      if (!roles.includes(payload.role)) return res.status(403).json({ message: 'Akses ditolak' })
      req.user = payload
      next()
    } catch (err) {
      return res.status(401).json({ message: 'Token invalid' })
    }
  }
}

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads')
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `avatar_${req.user?.id || 'guest'}${ext}`)
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

app.get('/dashboard', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/dashboard.html'))
)

app.get('/profile', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/profile.html'))
)

app.get('/admin', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin.html'))
)

app.get('/cart', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/cart.html'))
)

app.get('/edit', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/edit.html'))
)

app.get('/upload', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/upload.html'))
)

app.get('/product.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/product.html'))
)

app.get('/chatai', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/chatai.html'))
)

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})

/* ================= AUTH API ================= */
app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body

  const [rows] = await db.promise().query(
    'SELECT * FROM users WHERE username=? AND password=?',
    [usernameOrEmail, password]
  )

  if (!rows.length) return res.json({ success: false })

  const user = rows[0]

  // buat token per tab
  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role
  })

  res.json({
    success: true,
    token,
    role: user.role
  })
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  await db.promise().query(
    'INSERT INTO users (username,password,role) VALUES (?,?,?)',
    [username, password, 'user']
  )

  sendDashboardToAll()
  res.json({ success: true })
})