import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const loadProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async () => {
    if (!name || !price) return;
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price })
    });
    setName(''); setPrice('');
    loadProducts();
  };

  const updateProduct = async (id, newName, newPrice) => {
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: newName, price: newPrice })
    });
    loadProducts();
  };

  const deleteProduct = async (id) => {
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    loadProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tambah Produk</h2>
      <input placeholder="Nama" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Harga" type="number" value={price} onChange={e => setPrice(e.target.value)} />
      <button onClick={addProduct}>Tambah</button>

      <h2>Daftar Produk</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr><th>ID</th><th>Nama</th><th>Harga</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><input value={p.name} onChange={e => p.name = e.target.value} /></td>
              <td><input type="number" value={p.price} onChange={e => p.price = e.target.value} /></td>
              <td>
                <button onClick={() => updateProduct(p.id, p.name, p.price)}>Update</button>
                <button onClick={() => deleteProduct(p.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
