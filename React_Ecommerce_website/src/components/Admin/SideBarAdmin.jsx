import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaShoppingCart, FaBoxOpen, FaUsers, FaTimes } from "react-icons/fa";

const SidebBarAdmin = ({ isOpen, toggleSidebar }) => {
  const location = useLocation(); // Get the current location
  const path = location.pathname; // Current path

  return (
    <aside
      className={`bg-gray-900 text-white w-64 fixed md:relative transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out shadow-lg z-50 h-full`}
    >
      {/* Close button for small screens */}
      <button
        className="md:hidden absolute top-4 right-4 text-white focus:outline-none"
        onClick={toggleSidebar}
      >
        <FaTimes className="text-xl" />
      </button>

      {/* Logo / Branding */}
      <div className="text-center py-6 border-b border-gray-500">
        <h2 className="text-2xl font-bold text-blue-500">Admin Panel</h2>
        <span className="text-sm text-gray-400">Manage with ease</span>
      </div>

      {/* Menu Items */}
      <div className="mt-8">
        <NavLink
          to="/dashboard"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            path === "/dashboard" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          <FaHome className="mr-3 text-lg" />
          Dashboard
        </NavLink>
        <NavLink
          to="/dashboard/orders"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            path === "/dashboard/orders" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          <FaShoppingCart className="mr-3 text-lg" />
          Orders
        </NavLink>
        <NavLink
          to="/dashboard/productsAdmin"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            path === "/dashboard/productsAdmin" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          <FaBoxOpen className="mr-3 text-lg" />
          Products
        </NavLink>
        <NavLink
          to="/dashboard/users"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            path === "/dashboard/users" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          <FaUsers className="mr-3 text-lg" />
          Users
        </NavLink>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center text-xs text-gray-400">
        &copy; 2025 Admin Panel. All rights reserved.
      </div>
    </aside>
  );
};

export default SidebBarAdmin;
