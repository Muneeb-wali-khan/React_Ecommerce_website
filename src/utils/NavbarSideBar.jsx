import React, { useState } from "react";
import NavbarUser from "../components/User/NavbarUser";
import SideBarUser from "../components/User/SideBarUser";

function NavbarSideBar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBarUser isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <NavbarUser toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
}

export default NavbarSideBar;
