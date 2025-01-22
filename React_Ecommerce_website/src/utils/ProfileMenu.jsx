// ProfileMenu.js
import React from "react";
import { NavLink } from "react-router-dom";

const ProfileMenu = ({ isOpen, closeMenu, isAdmin }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-4 top-14 bg-gray-800 text-white rounded-lg shadow-lg w-40">
      {isAdmin ? (
        <NavLink
          to="/admin"
          className="block px-4 py-2 text-sm hover:bg-gray-700"
          onClick={closeMenu} 
        >
          Admin
        </NavLink>
      ) : (
        <>
          <NavLink
            to="/login"
            className="block px-4 py-2 text-sm hover:bg-gray-700"
            onClick={closeMenu} 
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="block px-4 py-2 text-sm hover:bg-gray-700"
            onClick={closeMenu} 
          >
            Register
          </NavLink>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;
