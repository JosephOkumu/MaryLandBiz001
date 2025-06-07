
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
          q: searchTerm || undefined, // Send search term to backend
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
  }, [currentPage, searchTerm]); // Refetch when currentPage or searchTerm changes

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm !== "") {
      setCurrentPage(1);
    } // Or simply setCurrentPage(1) if you always want to reset, even if search is cleared.
    // For now, only reset if search term is actively set.
  }, [searchTerm]);

  const handleDelete = (id: string) => {
    // Note: This is a frontend-only delete. For persistent deletion, an API call is needed.
    setBusinesses(businesses.filter(business => business.id !== id));
    // Decrement totalBusinesses if the deleted item was part of the current view's total
    // This is a simplification; a more robust solution would refetch or adjust based on API response
    setTotalBusinesses(prevTotal => Math.max(0, prevTotal -1)); 
    toast({
      title: "Business deleted (from view)",
      description: "The business has been removed from the current list.",
    });
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
