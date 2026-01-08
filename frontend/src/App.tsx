
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import { AuthProvider } from "./components/AuthContext"; // Adjusted path
import ProtectedRoute from "./components/ProtectedRoute"; // Adjusted path
import BusinessList from "./components/admin/BusinessList";
import AddBusiness from "./components/admin/AddBusiness";
import EditBusiness from "./components/admin/EditBusiness";
import Analytics from "./components/admin/Analytics";
import AdminSettings from "./components/admin/AdminSettings";
import ApplicationsPage from "./pages/admin/ApplicationsPage"; // Added for new Applications page
import AddMyBusiness from "./pages/AddMyBusiness";
import AdminLogin from "./pages/AdminLogin"; // Use user's original AdminLogin page
import BrowsePage from "./pages/BrowsePage"; // <-- Import BrowsePage
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/add-my-business" element={<AddMyBusiness />} />
              <Route path="/about" element={<About />} />
              {/* Admin Login Route - public */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  {/* Children of AdminLayout are now protected */}
                  <Route index element={<Dashboard />} />
                  <Route path="businesses" element={<BusinessList />} />
                  <Route path="businesses/add" element={<AddBusiness />} />
                  <Route path="businesses/edit/:id" element={<EditBusiness />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="applications" element={<ApplicationsPage />} /> {/* Added route for Applications page */}
                </Route>
              </Route>

              <Route path="/browse" element={<BrowsePage />} /> {/* <-- Add /browse route */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
