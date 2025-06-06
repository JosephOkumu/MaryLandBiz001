
import { useState, useEffect } from "react";
import { getBusinesses, Business } from "../../lib/api"; // Import API function and type
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";



const BusinessList = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all businesses for the dashboard view initially
        // Consider adding pagination if the list can be very long
        const response = await getBusinesses({ limit: 100, offset: 0 }); // Fetch up to 100 businesses
        setBusinesses(response.businesses || []); 
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
      setIsLoading(false);
    };

    fetchBusinesses();
  }, []);

  const handleDelete = (id: string) => {
    setBusinesses(businesses.filter(business => business.id !== id));
    toast({
      title: "Business deleted",
      description: "The business has been successfully removed",
    });
  };

  const filteredBusinesses = businesses.filter(business => 
    (business.business_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (business.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (business.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (business.contact_phone?.toLowerCase() || business.tel?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (business.contact_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );



  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Listed Businesses</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
            <Input
              type="search"
              placeholder="Search businesses..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link to="/dashboard/businesses/add">
              <Plus className="mr-2 h-4 w-4" strokeWidth={2.5} />
              Add Business
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Location</TableHead>
              <TableHead className="font-bold">Contact</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading businesses...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-red-600">
                  Error: {error}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !error && filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.business_name || 'N/A'}</TableCell>
                  <TableCell>{business.category || 'N/A'}</TableCell>
                  <TableCell>{business.location || 'N/A'}</TableCell>
                  <TableCell>
                    <div>{business.contact_phone || business.tel || 'N/A'}</div>
                    {business.contact_name && <div className="text-xs text-muted-foreground">{business.contact_name}</div>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link to={`/dashboard/businesses/edit/${business.id}`} title="Edit">
                          <Edit className="h-4 w-4" strokeWidth={2.5} />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(business.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !isLoading && !error && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No businesses found.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BusinessList;
