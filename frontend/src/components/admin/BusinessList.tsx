
import { useState } from "react";
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

// Sample data
const initialBusinesses = [
  { 
    id: "1", 
    name: "Chesapeake Tech Solutions", 
    category: "Technology",
    location: "Baltimore, MD",
    rating: 4.5,
    status: "active"
  },
  { 
    id: "2", 
    name: "Harbor View Restaurant", 
    category: "Restaurants",
    location: "Annapolis, MD",
    rating: 4.9,
    status: "active"
  },
  { 
    id: "3", 
    name: "Blue Ridge Builders", 
    category: "Construction",
    location: "Frederick, MD",
    rating: 4.0,
    status: "pending"
  },
  { 
    id: "4", 
    name: "Evergreen Health Center", 
    category: "Healthcare",
    location: "Rockville, MD",
    rating: 4.7,
    status: "active"
  },
  { 
    id: "5", 
    name: "Bayside Boutique", 
    category: "Retail",
    location: "Ocean City, MD",
    rating: 4.2,
    status: "inactive"
  }
];

const BusinessList = () => {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setBusinesses(businesses.filter(business => business.id !== id));
    toast({
      title: "Business deleted",
      description: "The business has been successfully removed",
    });
  };

  const filteredBusinesses = businesses.filter(business => 
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Businesses</h1>
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
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.name}</TableCell>
                  <TableCell>{business.category}</TableCell>
                  <TableCell>{business.location}</TableCell>
                  <TableCell>{business.rating}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(business.status)}`}>
                      {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/businesses/edit/${business.id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" strokeWidth={2.5} />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(business.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" strokeWidth={2.5} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No businesses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BusinessList;
