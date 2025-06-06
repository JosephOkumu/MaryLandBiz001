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
import { useState } from "react";
import { ApplicationReviewModal } from "@/components/admin/ApplicationReviewModal";

// Define the Application interface
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
  business_image_name?: string;
  dateSubmitted: string;
  status: "Pending" | "Approved" | "Rejected"; // Keep internal status if needed for other logic
}

const dummyApplications: Application[] = [
  {
    id: "app_001",
    business_name: "Coastal Breeze Cafe",
    location: "Ocean City, MD",
    contact_name: "Alice Wonderland",
    tel: "(410) 555-0101",
    email: "alice@coastalbreeze.com",
    website: "https://coastalbreeze.com",
    category: "Cafe",
    description: "A lovely cafe by the sea, offering fresh coffee and pastries.",
    business_image_name: "cafe_exterior.jpg",
    dateSubmitted: "2024-05-01",
    status: "Pending",
  },
  {
    id: "app_002",
    business_name: "Tech Innovators LLC",
    location: "Baltimore, MD",
    contact_name: "David Miller",
    tel: "410-555-5678",
    email: "david.miller@techinnovators.io",
    website: "https://techinnovators.io",
    category: "Technology",
    description: "Software development company specializing in AI solutions",
    business_image_name: "tech_innovators_logo.png",
    dateSubmitted: "2024-05-03",
    status: "Pending",
  },
  {
    id: "app_003",
    business_name: "Green Thumb Landscaping",
    location: "Rockville, MD",
    contact_name: "David Banner",
    tel: "(240) 555-0104",
    email: "david@greenthumb.com",
    category: "Landscaping",
    description: "Professional landscaping and garden design services.",
    business_image_name: "landscaping_logo.svg",
    dateSubmitted: "2024-05-08",
    status: "Pending",
  },
  {
    id: "app_004",
    business_name: "City Lights Bookstore",
    location: "Baltimore, MD",
    contact_name: "Carol Danvers",
    tel: "(443) 555-0103",
    email: "carol@citylights.com",
    website: "https://citylightsbooks.com",
    category: "Bookstore",
    description: "Independent bookstore with a wide selection of genres and local authors.",
    // business_image_name: undefined, // Example for no image
    dateSubmitted: "2024-05-05",
    status: "Pending",
  },
];

function ApplicationsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>(dummyApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openReviewModal = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleApprove = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    setApplications(prev => prev.filter(a => a.id !== applicationId));
    
    toast({
      title: "Application Approved",
      description: `${app?.business_name || 'The business'} has been approved and will be listed.`,
      className: "bg-green-100 border-green-400 text-green-700", 
    });
    setIsModalOpen(false);
    setSelectedApplication(null);
    // TODO: Add logic to move 'app' to the main business list (including image_name/url)
  };

  const handleReject = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    setApplications(prev => prev.filter(a => a.id !== applicationId));

    toast({
      title: "Application Rejected",
      description: `${app?.business_name || 'The business'} has been rejected.`,
      variant: "destructive",
    });
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  // Empty state example:
  if (applications.length === 0) {
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
        <h1 className="text-2xl font-bold mb-6">Pending Applications</h1>
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
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="font-medium">{app.business_name}</div>
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
                  <TableCell>{app.dateSubmitted}</TableCell>
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
