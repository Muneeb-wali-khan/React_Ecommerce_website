import React, { useState } from 'react';
import NavbarSideBar from '../../utils/NavbarSideBar';


function HomeUser() {
  return (
    <div>
        <NavbarSideBar/>
        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold">Welcome to es-Shop</h1>
          <p className="mt-4 text-lg">Browse our collection of products, manage your cart, and update your profile.</p>
          
        </main>
    </div>
  );
}

export default HomeUser;
