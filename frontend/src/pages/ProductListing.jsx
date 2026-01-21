import { useEffect, useState } from "react";

function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        // Show only the last 4 products
        const latestProducts = data.slice(-4).reverse();
        setProducts(latestProducts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading products...</h2>;
  if (error) return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ textAlign: "center" }}>Our Products</h1>

      {products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No products available</p>
      ) : (
        <div style={gridStyle}>
          {products.map((product) => (
            <div key={product._id} style={cardStyle}>
              <img
                src={product.image || "https://via.placeholder.com/200"}
                alt={product.name || "Product"}
                style={imageStyle}
              />

              <h3>{product.name}</h3>
              <p>{product.description || "No description available"}</p>
              <p>
                <strong>Price:</strong> Rs. {product.price}
              </p>
              <p>
                <strong>Rating:</strong> {"⭐".repeat(product.rating) || "No rating"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== Simple Styling ===== */
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "30px",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "15px",
  textAlign: "center",
  backgroundColor: "#fff",
  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
};

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "8px",
};

export default ProductListing;
