
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

// Sample data - Updated for new columns and added contact names
const initialBusinesses = [
  { 
    id: "1", 
    name: "Chesapeake Tech Solutions", 
    category: "Technology",
    location: "Baltimore, MD",
    contact_name: "Sarah Chen",
    tel: "(410) 555-1234"
  },
  { 
    id: "2", 
    name: "Harbor View Restaurant", 
    category: "Restaurants",
    location: "Annapolis, MD",
    contact_name: "Michael Lee",
    tel: "(443) 555-5678"
  },
  { 
    id: "3", 
    name: "Blue Ridge Builders", 
    category: "Construction",
    location: "Frederick, MD",
    contact_name: "David Miller",
    tel: "(301) 555-9012"
  },
  { 
    id: "4", 
    name: "Evergreen Health Center", 
    category: "Healthcare",
    location: "Rockville, MD",
    contact_name: "Dr. Emily Carter",
    tel: "(240) 555-3456"
  },
  { 
    id: "5", 
    name: "Bayside Boutique", 
    category: "Retail",
    location: "Ocean City, MD",
    contact_name: "Jessica Davis",
    tel: "(410) 555-7890"
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
    business.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (business.tel && business.tel.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (business.contact_name && business.contact_name.toLowerCase().includes(searchTerm.toLowerCase()))
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
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.name}</TableCell>
                  <TableCell>{business.category}</TableCell>
                  <TableCell>{business.location}</TableCell>
                  <TableCell>
                    <div>{business.contact_name}</div>
                    <div className="text-xs text-muted-foreground">{business.tel}</div>
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
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
