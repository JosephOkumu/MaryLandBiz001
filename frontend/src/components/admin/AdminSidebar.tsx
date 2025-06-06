
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Store, BarChart3, Settings, ClipboardList, PlusCircle } from "lucide-react"; // Added ClipboardList, kept PlusCircle for other uses if any

interface AdminSidebarProps {
  open: boolean;
}

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const AdminSidebar = ({ open }: AdminSidebarProps) => {
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

  if (!open) {
    return (
      <aside className="fixed left-0 top-16 bottom-0 z-20 hidden w-16 flex-col border-r border-gray-200 bg-white md:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex h-10 w-10 items-center justify-center rounded-md ${
                  isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                }`
              }
              title={item.title}
            >
              {item.icon}
            </NavLink>
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-16 bottom-0 z-20 hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
      <nav className="flex flex-col gap-1 px-3 py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 ${
                isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
