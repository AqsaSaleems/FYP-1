import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function tryParse(json) {
  if (!json) return null;
  if (typeof json === 'object') return json;
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function DesignView({ design }) {
  if (!design) return <div className="text-sm text-gray-600">No design</div>;
  const resolveImgSrc = (val) => {
    if (!val) return null;
    if (typeof val === 'string') {
      if (val.startsWith('blob:')) return null; // blob URLs aren't shareable between pages
      return val;
    }
    if (typeof val === 'object') {
      return val.dataURL || val.url || val.src || null;
    }
    return null;
  };

  const logoSrc = resolveImgSrc(design.logo);
  const stickerSrc = resolveImgSrc(design.selectedSticker?.url || design.selectedSticker);

  return (
    <div className="bg-gray-50 p-2 rounded">
      <div className="text-sm"><strong>Text:</strong> {design.designText || '—'}</div>
      <div className="text-sm"><strong>Color:</strong> <span className="inline-block w-4 h-4 align-middle mr-2" style={{background: design.selectedColor || '#000'}}></span>{design.selectedColor || '—'}</div>
      <div className="text-sm"><strong>Font:</strong> {design.selectedFont || '—'} ({design.fontSize || '—'} px)</div>
      <div className="text-sm mt-2"><strong>Logo:</strong> {logoSrc ? <img src={logoSrc} alt="logo" className="inline-block w-16 h-16 border" /> : (design.logo ? <span className="text-xs text-gray-500">Uploaded (preview not available)</span> : 'None')}</div>
      <div className="text-sm mt-2"><strong>Sticker:</strong> {stickerSrc ? <img src={stickerSrc} alt="sticker" className="inline-block w-16 h-16 border" /> : (design.selectedSticker ? <span className="text-xs text-gray-500">Sticker (preview not available)</span> : 'None')}</div>
      <div className="text-sm mt-2"><strong>Charge:</strong> PKR {Number(design.charge || 0).toFixed(2)}</div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders/admin');
      const json = await res.json();
      setOrders(json.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      const json = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === orderId ? json.order : o)));
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Orders History</h1>
      {orders.length === 0 && <div>No orders found.</div>}

      <div className="flex flex-col gap-4">
        {orders.map((o) => {
          const total = Number(o.total || 0).toFixed(2);
          return (
            <div key={o._id} className="border rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-semibold">Order ID: {o._id}</div>
                  <div className="text-sm text-gray-600">Placed: {new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">Total: PKR {total}</div>
                  <div className="text-sm">Status:
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="ml-2 border rounded p-1"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Items ({o.items?.length || 0})</div>
                <div className="flex flex-col gap-3">
                  {(o.items || []).map((it) => {
                    const customization = tryParse(it.customization) || {};
                    const front = customization.frontDesign || customization.front || null;
                    const back = customization.backDesign || customization.back || null;
                    const productPrice = Number(it.price || it.productPrice || 0);
                    const customizationPrice = Number(it.customizationPrice || customization.totalCharge || customization.totalCharge || 0);
                    const lineTotal = ((productPrice + customizationPrice) * (it.quantity || 1)).toFixed(2);
                    return (
                      <div key={it._id || it.productId} className="flex gap-3 items-start">
                        <img src={it.frontImage || it.image} alt={it.name} className="w-20 h-20 object-cover border" />
                        <div className="flex-1">
                          <div className="font-semibold">{it.name} x{it.quantity}</div>
                          <div className="text-sm text-gray-600">Size: {it.size || 'N/A'}</div>
                          <div className="text-sm">Product price: PKR {productPrice.toFixed(2)}</div>
                          <div className="text-sm">Customization price: PKR {customizationPrice.toFixed(2)}</div>
                          <div className="text-sm font-semibold">Line total: PKR {lineTotal}</div>

                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <div className="font-semibold">Front Design</div>
                              <DesignView design={front} />
                            </div>
                            <div>
                              <div className="font-semibold">Back Design</div>
                              <DesignView design={back} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
