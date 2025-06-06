
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import Footer from "../Footer";

const AdminLayout = () => {
  // const [sidebarOpen, setSidebarOpen] = useState(true); // Removed for permanently open sidebar

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader /> {/* Removed setSidebarOpen and sidebarOpen props */}
      <div className="flex flex-1">
        <AdminSidebar open={true} /> {/* Sidebar is always open */}
        <div className={`flex-1 transition-all flex flex-col md:ml-64`}> {/* Sidebar is always open, so margin is always applied */}
          <main className="flex-1 p-4 md:p-8 pt-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
