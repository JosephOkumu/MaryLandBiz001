
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

const AdminSidebar = (/*{ open }: AdminSidebarProps*/) => { // 'open' prop is no longer used as sidebar is always open
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

  // The 'open' prop is always true, so the collapsed sidebar logic is removed.

  return (
    // Removed: fixed left-0 top-16 bottom-0 z-20
    // Removed: h-full (height will be determined by parent flex container)
    <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
      {/* Added: flex-1 to make nav fill aside, overflow-y-auto for scrollable navigation */}
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
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
