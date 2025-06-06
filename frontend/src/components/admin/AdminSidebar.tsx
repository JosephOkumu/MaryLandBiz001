import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { LayoutDashboard, Store, BarChart3, Settings, ClipboardList, PlusCircle } from "lucide-react"; // Added ClipboardList, kept PlusCircle for other uses if any
import { Badge } from "@/components/ui/badge";

interface AdminSidebarProps {
  open: boolean;
}

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

interface NewBusinessApplication {
  id: string;
  businessName: string;
  location: string;
  category: string;
  contactName?: string;
  tel: string;
  email: string;
  website?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  isNew: boolean;
}

const AdminSidebar = () => {
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);

  const updateNotificationCount = () => {
    try {
      const storedData = localStorage.getItem('businessApplications');
      const applications: NewBusinessApplication[] = storedData ? JSON.parse(storedData) : [];
      const newItemsCount = applications.filter(app => app.isNew).length;
      setNewApplicationsCount(newItemsCount);
    } catch (e) {
      console.error("Failed to parse business applications from localStorage for sidebar", e);
      setNewApplicationsCount(0);
    }
  };

  useEffect(() => {
    updateNotificationCount(); // Initial load

    const handleStorageUpdate = () => {
      updateNotificationCount();
    };

    window.addEventListener('localStorageUpdated', handleStorageUpdate);
    window.addEventListener('storage', (event) => {
      if (event.key === 'businessApplications') {
        handleStorageUpdate();
      }
    });

    return () => {
      window.removeEventListener('localStorageUpdated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" strokeWidth={2.5} />,
    },
    {
      title: "Applications",
      href: "/dashboard/applications",
      icon: <ClipboardList className="h-5 w-5" strokeWidth={2.5} />,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5" strokeWidth={2.5} />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" strokeWidth={2.5} />,
    },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
      <nav className="flex flex-col flex-1 gap-1 px-3 py-6 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/dashboard"} // Add end prop for Dashboard link
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 ${
                isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.title}</span>
            {item.title === "Applications" && newApplicationsCount > 0 && (
              <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                {newApplicationsCount}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
