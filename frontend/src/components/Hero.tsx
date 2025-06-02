
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const { toast } = useToast();

  const handleSearch = () => {
    toast({
      title: "Search initiated",
      description: `Searching for "${searchTerm}" in category "${category}"`,
      duration: 3000,
    });
    
    console.log("Search:", { searchTerm, category });
    // In a real application, this would navigate to search results or filter content
  };

  return (
    <section className="hero-gradient py-16 text-white">
      <div className="container text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 animate">
          Discover Maryland's Minority Businesses
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 animate delay-1">
          Find local businesses, services, and professionals. Connect with them directly and discover why Maryland is a great place to do business.
        </p>
        
        <div className="max-w-3xl mx-auto bg-white rounded-full p-2 flex flex-col md:flex-row gap-2 shadow-lg animate delay-2">
          <Select 
            defaultValue="all" 
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger className="w-full md:w-[200px] bg-[#F5F5F5] rounded-full border-none">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="restaurants">Restaurants</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="professional">Professional Services</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
            </SelectContent>
          </Select>
          
          <Input 
            type="text" 
            placeholder="Search businesses, services, or keywords..."
            className="flex-1 bg-white border-none rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearch()}
          />
          
          <Button 
            className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-white rounded-full font-bold"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" strokeWidth={2.5} />
            Search
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
