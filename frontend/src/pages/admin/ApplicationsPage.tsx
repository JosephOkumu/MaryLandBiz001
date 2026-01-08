// /frontend/src/pages/admin/ApplicationsPage.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, CheckCircle2 as CheckCircle2Icon, XCircle as XCircleIcon, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import { ApplicationReviewModal } from "@/components/admin/ApplicationReviewModal";
import { API_BASE_URL } from "@/lib/api";

// Define the Application interface
// Interface for applications from localStorage, mirroring what AddMyBusiness will save
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

// Existing interface for table display
interface Application {
  id: string;
  business_name: string;
  location: string;
  contact_name: string;
  tel: string;
  email: string;
  website?: string;
  category: string;
  description: string;
  image_url?: string; // Added for uploaded images
  business_image_name?: string;
  dateSubmitted: string;
  status: "Pending" | "Approved" | "Rejected";
  isNew?: boolean; // For highlighting new items from localStorage
  isFromLocalStorage?: boolean; // To differentiate source
}

const dummyApplications: Application[] = [];

function ApplicationsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/business-applications?status=pending`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const formattedData = data.map((app: any) => ({
          id: app.id.toString(),
          business_name: app.businessName,
          location: app.location,
          contact_name: app.contactName || '',
          tel: app.tel,
          email: app.email,
          website: app.website || '',
          category: app.category,
          description: app.description || '',
          image_url: app.image_url || '', // Include image_url from backend
          business_image_name: '',
          dateSubmitted: new Date(app.submittedAt).toISOString().split('T')[0],
          status: app.status.charAt(0).toUpperCase() + app.status.slice(1) as 'Pending' | 'Approved' | 'Rejected',
          isNew: false,
          isFromLocalStorage: false,
        }));
        const pendingApps = formattedData.filter(app => app.status === 'Pending');
        setApplications(formattedData);
        setPendingCount(pendingApps.length);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({ title: "Error loading applications", variant: "destructive" });
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [searchParams, toast]);

  // Show loading state or empty state more robustly
  if (isLoading) {
    return <div className="p-6">Loading applications...</div>;
  }

  const openReviewModal = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleApprove = async (applicationToApprove: Application) => {
    if (!applicationToApprove) {
      toast({ title: "Error", description: "Application data not found.", variant: "destructive" });
      return;
    }

    console.log("Approving application:", applicationToApprove);

    try {
      // The backend now handles creating the business entry when status is set to 'approved'
      const statusResponse = await fetch(`${API_BASE_URL}/api/business-applications/${applicationToApprove.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
        credentials: 'include',
      });

      if (!statusResponse.ok) {
        let errorMessage = `Failed to approve application: ${statusResponse.statusText}`;
        try {
          const errorData = await statusResponse.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Failed to parse JSON, use statusText
        }
        throw new Error(errorMessage);
      }

      // Update UI
      setApplications(prev => prev.filter(a => a.id !== applicationToApprove.id));
      toast({
        title: "Application Approved",
        description: `${applicationToApprove.business_name} has been approved and added to the directory.`,
        className: "bg-green-100 border-green-400 text-green-700",
      });
      setIsModalOpen(false);
      setSelectedApplication(null);
      window.dispatchEvent(new CustomEvent('applicationProcessed'));

    } catch (error: any) {
      console.error('Error approving application:', error);
      toast({
        title: "Approval Failed",
        description: error.message || "An unexpected error occurred while approving the application.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (applicationToReject: Application) => {
    if (!applicationToReject) {
      toast({ title: "Error", description: "Application data not found.", variant: "destructive" });
      return;
    }
    console.log("Rejecting application:", applicationToReject);

    try {
      const statusResponse = await fetch(`${API_BASE_URL}/api/business-applications/${applicationToReject.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
        credentials: 'include',
      });

      if (!statusResponse.ok) {
        let errorMessage = `Failed to update application status: ${statusResponse.statusText}`;
        try {
          const errorData = await statusResponse.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Failed to parse JSON, use statusText
        }
        throw new Error(errorMessage);
      }

      setApplications(prev => prev.filter(a => a.id !== applicationToReject.id));
      toast({
        title: "Application Rejected",
        description: `${applicationToReject.business_name} has been rejected.`,
        variant: "default",
      });
      setIsModalOpen(false);
      setSelectedApplication(null);
      window.dispatchEvent(new CustomEvent('applicationProcessed'));

    } catch (error: any) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Rejection Failed",
        description: error.message || "An unexpected error occurred while rejecting the application.",
        variant: "destructive",
      });
    }
  };

  // Empty state example:
  // This check should come after isLoading is false
  if (!isLoading && applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 md:p-6">
        <CheckCircle2Icon className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">All Caught Up!</h2>
        <p className="text-muted-foreground">There are no new business applications awaiting review.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">Pending Applications <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">{pendingCount}</span></h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listing Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Contact</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} className={app.isNew && app.isFromLocalStorage ? 'bg-yellow-100 hover:bg-yellow-200' : ''}>
                  <TableCell>
                    <div className="font-medium">{app.business_name}
                      {app.isNew && app.isFromLocalStorage && <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-700 bg-yellow-50">New</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground md:hidden">
                      {app.category}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {app.category}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div>{app.contact_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {app.email}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(app.dateSubmitted).toISOString().replace('T', ' ').slice(8, 10)}-{new Date(app.dateSubmitted).toISOString().slice(5, 7)}-{new Date(app.dateSubmitted).toISOString().slice(0, 4)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white focus-visible:ring-green-500"
                      onClick={() => openReviewModal(app)}
                    >
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedApplication && (
        <ApplicationReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedApplication(null);
          }}
          application={selectedApplication}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default ApplicationsPage;
