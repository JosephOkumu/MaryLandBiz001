
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import Footer from "../Footer";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1">
        <AdminSidebar open={sidebarOpen} />
        <div className={`flex-1 transition-all flex flex-col ${sidebarOpen ? "md:ml-64" : ""}`}>
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
