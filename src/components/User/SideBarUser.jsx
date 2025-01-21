import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaShoppingCart, FaBoxOpen, FaUserCircle, FaTimes } from "react-icons/fa";

const SidebArUser = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside
      className={`bg-gray-900 md:hidden text-white w-64 fixed md:relative transform md:translate-x-0 transition-transform duration-200 ease-in-out shadow-lg z-50 h-full ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close button for small screens */}
      <button
        className="md:hidden absolute top-4 right-4 text-white focus:outline-none"
        onClick={toggleSidebar}
      >
        <FaTimes className="text-xl" />
      </button>

      {/* Branding / Logo */}
      <div className="text-center py-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-blue-500">es-Shop</h2>
        <span className="text-sm text-gray-400">Shop Smart, Shop Easy</span>
      </div>

      {/* Navigation Menu */}
      <div className="mt-8">
        <NavLink
          to="/"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            path === "/" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          <FaHome className="mr-3 text-lg" />
          Home
        </NavLink>
        <NavLink
          to="/cart"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            path === "/cart" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          <FaShoppingCart className="mr-3 text-lg" />
          Cart
        </NavLink>
        <NavLink
          to="/products"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            path === "/products" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          <FaBoxOpen className="mr-3 text-lg" />
          Products
        </NavLink>
        <NavLink
          to="/profile"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            path === "/profile" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          <FaUserCircle className="mr-3 text-lg" />
          Profile
        </NavLink>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center text-xs text-gray-400">
        &copy; 2025 es-Shop. All rights reserved.
      </div>
    </aside>
  );
};

export default SidebArUser;
