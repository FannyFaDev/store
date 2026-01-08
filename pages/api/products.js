import { db } from '../../db';

export default function handler(req, res) {
    const method = req.method;

    if (method === 'GET') {
        db.query('SELECT * FROM products', (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).json(results);
        });
    } else if (method === 'POST') {
        const { name, price } = req.body;
        db.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.status(201).json({ message: 'Produk ditambahkan', id: result.insertId });
        });
    } else if (method === 'PUT') {
        const { id, name, price } = req.body;
        db.query('UPDATE products SET name = ?, price = ? WHERE id = ?', [name, price, id], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).json({ message: 'Produk diupdate' });
        });
    } else if (method === 'DELETE') {
        const { id } = req.body;
        db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).json({ message: 'Produk dihapus' });
        });
    } else {
        res.setHeader('Allow', ['GET','POST','PUT','DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
