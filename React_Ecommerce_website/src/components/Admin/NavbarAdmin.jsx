import React from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';

const NavbarAdmin = ({ toggleSidebar }) => {
  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
      {/* Sidebar Toggle Button */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={toggleSidebar}
      >
        <FaBars className="text-xl" />
      </button>

      {/* Title */}
      <h1 className="text-lg font-bold">Admin Dashboard</h1>

      {/* User Profile */}
      <div className="flex items-center space-x-4">
        <FaUserCircle className="text-2xl" />
        <span>Admin</span>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
