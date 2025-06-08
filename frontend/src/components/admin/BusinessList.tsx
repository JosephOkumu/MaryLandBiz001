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
import { Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"; // Added Chevrons for pagination
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";



const BUSINESSES_PER_PAGE = 50;

const BusinessList = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // New state for debounced search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBusinessData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * BUSINESSES_PER_PAGE;
        const response = await getBusinesses({
          limit: BUSINESSES_PER_PAGE,
          offset,
          q: debouncedSearchTerm || undefined, // Send debounced search term to backend
        });
        setBusinesses(response.businesses || []);
        setTotalBusinesses(response.total || 0);
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setBusinesses([]); // Clear businesses on error
        setTotalBusinesses(0);
      }
      setIsLoading(false);
    };

    fetchBusinessData();
  }, [currentPage, debouncedSearchTerm]); // Refetch when currentPage or debouncedSearchTerm changes

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Reset to page 1 when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== "" || searchTerm === "") { // Reset if debounced term is set, or if search is cleared
        setCurrentPage(1);
    }
  }, [debouncedSearchTerm, searchTerm]); // Watch both to catch clearing the search

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this business? This action cannot be undone.");
    if (!confirmed) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/businesses/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Necessary for session cookies
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Business deleted",
          description: "The business has been permanently deleted.",
        });
        // Delay page reload to allow user to see toast message
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Delay of 2 seconds
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete business. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.ceil(totalBusinesses / BUSINESSES_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5; 
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let showStartEllipsis = currentPage > halfMaxPages + 1;
      let showEndEllipsis = currentPage < totalPages - halfMaxPages;

      let startPage = Math.max(2, currentPage - halfMaxPages +1);
      let endPage = Math.min(totalPages - 1, currentPage + halfMaxPages -1);

      if (currentPage <= halfMaxPages) { 
        startPage = 2;
        endPage = Math.min(totalPages -1, maxPagesToShow - 2); 
        showStartEllipsis = false;
      } else if (currentPage > totalPages - halfMaxPages) { 
        startPage = Math.max(2, totalPages - (maxPagesToShow - 3));
        endPage = totalPages - 1;
        showEndEllipsis = false;
      }
      
      if (showStartEllipsis) {
        pageNumbers.push('...'); 
      }

      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) pageNumbers.push(i);
      }

      if (showEndEllipsis) {
        pageNumbers.push('...'); 
      }
      if (totalPages > 1) pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading businesses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

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
            {businesses.length > 0 ? (
              businesses.map((business) => (
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
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchTerm ? `No businesses found for "${searchTerm}".` : "No businesses found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 0 && businesses.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePreviousPage(); }}
                  />
                </PaginationItem>
              )}
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageClick(page as number); }}
                      isActive={currentPage === page}
                      className={`
                        ${currentPage === page 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'hover:bg-blue-100 hover:text-blue-700'
                        }
                      `}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleNextPage(); }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default BusinessList;
