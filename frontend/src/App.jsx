import { useState } from 'react';

function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    price: 0,
    rating: 0,
    image: '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        rating: Number(form.rating),
      }),
    });

    if (res.ok) {
      alert('Product added successfully');
      setForm({ name: '', price: 0, rating: 0, image: '' });
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Admin – Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2" />

        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price (PKR)" className="w-full border p-2" />

        <input name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} placeholder="Rating" className="w-full border p-2" />

        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border p-2" />

        <button className="bg-black text-white px-6 py-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
