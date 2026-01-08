import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building, Bell, User, Mail } from "lucide-react"; // Removed Menu as it's not used
import { useAuth } from "../../components/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interface for applications from localStorage (should match ApplicationsPage.tsx and AddMyBusiness.tsx)
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

const AdminHeader = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth(); // Added useAuth
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);
  const [newApplicationsList, setNewApplicationsList] = useState<NewBusinessApplication[]>([]);

  const updateNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/business-applications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const applications = await response.json();
      const newItems = applications.filter((app: any) => app.status === 'pending');
      setNewApplicationsCount(newItems.length);
      setNewApplicationsList(newItems.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
    } catch (e) {
      console.error("Failed to fetch business applications from backend for header", e);
      setNewApplicationsCount(0);
      setNewApplicationsList([]);
    }
  };

  useEffect(() => {
    updateNotifications(); // Initial load

    const intervalId = setInterval(() => {
      updateNotifications(); // Poll every 30 seconds for new applications
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleNotificationClick = (appId: string) => {
    navigate(`/admin/applications?id=${appId}`);
    // The ApplicationsPage will handle marking it as not new and updating localStorage
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Hamburger menu button removed */}
          <Link to="/" className="flex items-center space-x-2 ml-14"> {/* Corrected to ml-14 to accurately restore position */}
            <Building className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <span className="text-xl font-bold">
              <span className="text-[#0061A8]">Maryland</span>
              <span className="text-secondary">Biz</span> Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Dropdown - Tied to Bell Icon */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" strokeWidth={2.5} />
                {newApplicationsCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 z-50">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                {newApplicationsCount > 0 && <Badge variant="destructive">{newApplicationsCount}</Badge>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {newApplicationsCount > 0 ? (
                newApplicationsList.map(app => (
                  <DropdownMenuItem
                    key={app.id}
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleNotificationClick(app.id)}
                  >
                    <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <div className="truncate text-sm font-medium">
                        {app.businessName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {new Date(app.submittedAt).toISOString().replace('T', ' ').slice(8, 10)}-{new Date(app.submittedAt).toISOString().slice(5, 7)}-{new Date(app.submittedAt).toISOString().slice(0, 4)} {new Date(app.submittedAt).toISOString().slice(11, 16)} UTC
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="p-3 text-center text-muted-foreground">
                  No new notifications
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/applications" className="flex items-center justify-center p-2 text-sm font-medium text-primary hover:bg-muted/50">
                  View all applications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
                  <User className="h-4 w-4" strokeWidth={2.5} />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 z-50">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => { await logout(); navigate('/admin/login'); /* Navigate to admin login page after logout */ }}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
