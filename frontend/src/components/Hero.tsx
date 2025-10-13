import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getCategories, Category } from "@/lib/api"; // Import Category type
import { cn } from "@/lib/utils"; // For conditional class names

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const heroImages = [
    "/images/maryland1.png",
    "/images/maryland2.jpeg", 
    "/images/Maryland4.png"
  ];

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    
    // Auto-play functionality
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleSearch = () => {
    if (!searchTerm && !selectedCategory) {
      toast({
        title: "Search criteria needed",
        description: "Please enter a search term or select a category.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const params = new URLSearchParams();
    if (searchTerm) {
      params.append("q", searchTerm);
    }
    if (selectedCategory) {
      // Assuming your backend /api/businesses expects category name
      // If it expects category ID, use selectedCategory.id
      params.append("category", selectedCategory.name);
    }
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <section className="relative py-20 text-white min-h-[80vh] flex items-center overflow-hidden">
      {/* Carousel Background */}
      <div className="embla absolute inset-0" ref={emblaRef}>
        <div className="embla__container flex">
          {heroImages.map((image, index) => (
            <div key={index} className="embla__slide flex-[0_0_100%] relative">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${image})`,
                  minHeight: '80vh'
                }}
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Content overlay */}
      <div className="container text-center w-full relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 animate">
          Discover Maryland's Minority Businesses
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 animate delay-1">
          Find local businesses, services, and professionals. Connect with them
          directly and discover why Maryland is a great place to do business.
        </p>

        <div className="max-w-3xl mx-auto bg-white rounded-full p-2 flex flex-col md:flex-row gap-2 shadow-lg animate delay-2">
          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={comboboxOpen}
                className="w-full md:w-[250px] justify-between bg-[#F5F5F5] rounded-full border-none text-black hover:bg-gray-200"
              >
                {selectedCategory
                  ? selectedCategory.name || "[No Name]"
                  : "Select category..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full md:w-[250px] p-0">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>
                    {isLoadingCategories
                      ? "Loading categories..."
                      : "No category found."}
                  </CommandEmpty>
                  {isErrorCategories && (
                    <p className="p-2 text-sm text-red-600">
                      Error loading categories.
                    </p>
                  )}
                  <CommandGroup>
                    <CommandItem
                      key="all-categories"
                      value="" // Representing no specific category
                      onSelect={() => {
                        setSelectedCategory(null);
                        setComboboxOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !selectedCategory ? "opacity-100" : "opacity-0",
                        )}
                      />
                      All Categories
                    </CommandItem>
                    {categories?.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name || ""}
                        onSelect={(currentValue) => {
                          const newSelectedCategory = categories.find(
                            (c) =>
                              (c.name || "").toLowerCase() ===
                              currentValue.toLowerCase(),
                          );
                          setSelectedCategory(newSelectedCategory || null);
                          setComboboxOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategory?.name === category.name
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {category.name || "[No Name]"}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Input
            type="text"
            id="hero-search-input" // Added ID for scrolling
            placeholder="Search businesses, services, or keywords..."
            className="flex-1 bg-white border-none rounded-full text-black"
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

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                selectedIndex === index 
                  ? "bg-white scale-110" 
                  : "bg-white/50 hover:bg-white/70"
              )}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
