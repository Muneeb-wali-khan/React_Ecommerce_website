import { Route } from "react-router-dom";
import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import HomeUser from "./pages/User/HomeUser";
import ProductsAdmin from "./pages/Admin/ProductsAdmin";
import Products from "./pages/User/Products/Products";

// routes
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeUser />} />
        <Route path="/products" element={<Products />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route path="productsAdmin" element={<ProductsAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
