
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Businesses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  };

  const performSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a search term",
        description: "Enter a business name to search",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically make an API call to search businesses
    console.log("Searching for:", searchTerm);
    toast({
      title: "Searching...",
      description: `Looking for businesses matching: ${searchTerm}`,
    });
    
    // Mock results for demo purposes
    setSearchResults([]);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Businesses</h1>
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
              <Input
                placeholder="Enter business name to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="pl-8"
              />
            </div>
            <Button onClick={performSearch} className="shrink-0">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results section */}
      <div className="space-y-4">
        {searchResults.map((business) => (
          <Card key={business.id}>
            <CardContent className="pt-6">
              {/* Business details would go here */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Businesses;
