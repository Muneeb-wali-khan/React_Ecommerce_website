// NavbarUser.js
import React, { useState } from "react";
import { FaBars, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import ProfileMenu from "../../utils/ProfileMenu"; 

const NavbarUser = ({ toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const handleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Close the menu
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex gap-12 items-center">
      {/* Sidebar Toggle */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={toggleSidebar}
      >
        <FaBars className="text-xl" />
      </button>

      {/* Logo */}
      <NavLink to="/" className="text-lg font-bold text-blue-500">
        es-Shop
      </NavLink>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6">
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `text-sm font-medium ${isActive ? "text-blue-500" : "hover:text-gray-400"}`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `text-sm font-medium ${isActive ? "text-blue-500" : "hover:text-gray-400"}`
          }
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `text-sm font-medium ${isActive ? "text-blue-500" : "hover:text-gray-400"}`
          }
        >
          Contact
        </NavLink>
      </div>

      {/* Icons (Cart & User Profile) */}
      <div className="flex items-end justify-end flex-grow space-x-6">
        <NavLink to="/cart" className="relative">
          <FaShoppingCart className="text-2xl hover:text-gray-400" />
          <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white rounded-full px-2">
            3
          </span>
        </NavLink>

        {/* User Profile Button */}
        <button onClick={handleMenuOpen}>
          <FaUserCircle className="text-2xl hover:text-gray-400" />
        </button>
      </div>

      {/* Profile Menu */}
      <ProfileMenu isOpen={isMenuOpen} isAdmin={false} closeMenu={closeMenu} />
    </nav>
  );
};

export default NavbarUser;
