import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import ProductListing from "./pages/ProductListing";
import AddProduct from "./pages/admin/AddProduct";

function App() {
  return (
    <Router>
      <Navigation />

      <Routes>
        <Route path="/" element={<ProductListing />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
