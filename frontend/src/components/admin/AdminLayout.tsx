
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
      <div className="flex flex-1 bg-white"> {/* Added bg-white to this container */}
        <AdminSidebar /> {/* 'open' prop removed as sidebar no longer uses it */}
        {/* md:ml-64 removed as sidebar is no longer fixed and content will flow naturally */}
        <div className={`flex-1 transition-all flex flex-col bg-white`}> {/* Added bg-white */}
          <main className="flex-1 p-4 md:p-8 pt-6">
            <Outlet />
          </main>
          {/* Footer moved out of this div */}
        </div>
      </div>
      <Footer /> {/* Footer is now a direct child of the main flex-col div */}
    </div>
  );
};

export default AdminLayout;
