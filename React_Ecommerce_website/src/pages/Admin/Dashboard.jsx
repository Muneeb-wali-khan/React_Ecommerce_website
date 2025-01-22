import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavbarAdmin from "../../components/Admin/NavbarAdmin";
import SidebBarAdmin from "../../components/Admin/SideBarAdmin";
import DashBoardContent from "./DashBoardContent";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SidebBarAdmin
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <NavbarAdmin toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-100">
          {path === "/dashboard" ? <DashBoardContent /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
