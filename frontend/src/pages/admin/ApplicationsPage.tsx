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
import { MoreHorizontalIcon, CheckCircle2 as CheckCircle2Icon } from "lucide-react"; // Renamed CheckCircle2 to avoid conflict if used as component

function ApplicationsPage() {
  const pendingApplications = [
    {
      id: "app_001",
      businessName: "Coastal Breeze Cafe",
      category: "Restaurants",
      contactName: "Sarah Chen",
      contactEmail: "sarah.chen@example.com",
      dateSubmitted: "June 5, 2025",
      status: "Pending Review",
    },
    {
      id: "app_002",
      businessName: "Tech Innovators LLC",
      category: "Technology",
      contactName: "David Miller",
      contactEmail: "david.miller@techinnovators.io",
      dateSubmitted: "June 4, 2025",
      status: "Pending Review",
    },
    {
      id: "app_003",
      businessName: "GreenScape Landscaping",
      category: "Home Services",
      contactName: "Maria Rodriguez",
      contactEmail: "maria.r@greenscape.com",
      dateSubmitted: "June 2, 2025",
      status: "Pending Review",
    },
    {
      id: "app_004",
      businessName: "The Artisan Bakery",
      category: "Food & Drink",
      contactName: "Tom Wilson",
      contactEmail: "tom.wilson@artisanbakery.com",
      dateSubmitted: "June 1, 2025",
      status: "Pending Review",
    },
  ];

  // Empty state example:
  if (pendingApplications.length === 0) {
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
              {pendingApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="font-medium">{app.businessName}</div>
                    <div className="text-sm text-muted-foreground md:hidden">
                      {app.category}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {app.category}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div>{app.contactName}</div>
                    <div className="text-sm text-muted-foreground">
                      {app.contactEmail}
                    </div>
                  </TableCell>
                  <TableCell>{app.dateSubmitted}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="w-4 h-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => alert(`Reviewing: ${app.businessName}`)}
                        >
                          Review & Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => alert(`Quick Approving: ${app.businessName}`)}
                          className="text-green-600 hover:!text-green-700 focus:text-green-700"
                        >
                          Quick Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => alert(`Rejecting: ${app.businessName}`)}
                          className="text-red-600 hover:!text-red-700 focus:text-red-700"
                        >
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApplicationsPage;
