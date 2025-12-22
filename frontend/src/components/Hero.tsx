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

  // Dynamic text colors based on carousel image
  const textColors = [
    "bg-gradient-to-r from-blue-200 to-blue-900", // Navy blue for maryland1.png (yellow dominant)
    "bg-gradient-to-r from-orange-300 to-red-500", // Orange-red for maryland2.jpeg
    "bg-gradient-to-r from-yellow-300 to-yellow-600" // Yellow for Maryland4.png
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
    <section className="relative py-12 md:py-20 text-white min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
      {/* Carousel Background */}
      <div className="embla absolute inset-0" ref={emblaRef}>
        <div className="embla__container flex">
          {heroImages.map((image, index) => (
            <div key={index} className="embla__slide flex-[0_0_100%] relative">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${image})`,
                  minHeight: '70vh'
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
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-8 animate leading-tight">
            <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
              Discover Maryland's
            </span>
            <span className={`block ${textColors[selectedIndex]} bg-clip-text text-transparent drop-shadow-lg mt-1 md:mt-2 transition-all duration-500`}>
              Minority Businesses
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto text-gray-100 animate delay-1 leading-relaxed font-light">
            Find local businesses, services, and professionals. Connect with them
            directly and discover why Maryland is a great place to do business.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-2 md:p-3 flex flex-col md:flex-row gap-2 md:gap-3 shadow-2xl animate delay-2 border border-white/20 mx-4">
          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={comboboxOpen}
                className="w-full md:w-[280px] justify-between bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl text-gray-800 hover:text-gray-900 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] relative overflow-hidden h-12 md:h-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 truncate">
                  {selectedCategory
                    ? selectedCategory.name || "[No Name]"
                    : "Select category..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-200 relative z-10" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-3rem)] md:w-[250px] p-0">
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
            placeholder="Search businesses..."
            className="flex-1 bg-white border-none rounded-xl text-black text-base md:text-lg px-4 md:px-6 py-3 md:py-4 font-medium placeholder:text-gray-500 h-12 md:h-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearch()}
          />

          <Button
            className="w-full md:w-auto bg-gradient-to-r from-secondary to-orange-600 hover:from-secondary/90 hover:to-orange-700 text-white rounded-xl font-bold px-8 py-3 md:py-4 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-200 h-12 md:h-auto"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-5 w-5" strokeWidth={2.5} />
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
