import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getBusinesses, Category, Business, API_BASE_URL } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

const AddMyBusiness = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [applicationType, setApplicationType] = useState<'new' | 'edit'>('new');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [businessSearch, setBusinessSearch] = useState("");
  const [searchError, setSearchError] = useState("");

  // Form field states for pre-filling
  const [formData, setFormData] = useState({
    business_name: "",
    location: "",
    contact_name: "",
    tel: "",
    email: "",
    website: "",
    description: ""
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Debounce business search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(businessSearch), 300);
    return () => clearTimeout(timer);
  }, [businessSearch]);

  const { data: businessesData, isFetching: isSearching } = useQuery({
    queryKey: ["businesses", debouncedSearch],
    queryFn: () => getBusinesses({ limit: 10, offset: 0, q: debouncedSearch }),
    enabled: applicationType === 'edit' && debouncedSearch.length > 1
  });

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusinessId(business.id.toString());
    setBusinessSearch(business.business_name);
    setSearchError("");
    setFormData({
      business_name: business.business_name || "",
      location: business.location || "",
      contact_name: business.contact_name || "",
      tel: business.tel || "",
      email: business.email || "",
      website: business.website || "",
      description: business.description || ""
    });
    setSelectedCategory(business.category || "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const rawFormData = new FormData(formElement);

    const submitData = new FormData();
    submitData.append('businessName', formData.business_name);
    submitData.append('location', formData.location);
    submitData.append('category', selectedCategory);
    submitData.append('contactName', formData.contact_name);
    submitData.append('tel', formData.tel);
    submitData.append('email', formData.email);
    submitData.append('website', formData.website);
    submitData.append('description', formData.description);
    submitData.append('applicationType', applicationType);
    if (applicationType === 'edit' && selectedBusinessId) {
      submitData.append('businessId', selectedBusinessId);
    }

    const imageFile = rawFormData.get('business_image') as File;
    if (imageFile && imageFile.size > 0) {
      submitData.append('business_image', imageFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/business-applications`, {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: applicationType === 'new' ? "Request Submitted" : "Update Requested",
        description: applicationType === 'new'
          ? "We've received your business request. Our team will review it shortly."
          : "We've received your update request. Our team will review it shortly.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Error",
        description: "Could not submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      <div className="container max-w-4xl py-12 flex-grow">
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4 text-gray-900"
          >
            Manage Your Business Listing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Submit a new business or request updates to an existing one.
          </motion.p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            className={cn(
              "h-16 px-8 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border-2",
              applicationType === 'new'
                ? "bg-gradient-to-r from-primary to-blue-600 text-white border-transparent shadow-lg scale-105"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-blue-50/50"
            )}
            onClick={() => {
              setApplicationType('new');
              setSelectedBusinessId("");
              setBusinessSearch("");
              setSearchError("");
              setFormData({
                business_name: "",
                location: "",
                contact_name: "",
                tel: "",
                email: "",
                website: "",
                description: ""
              });
              setSelectedCategory("");
            }}
          >
            <Plus className={cn("h-5 w-5", applicationType === 'new' ? "text-white" : "text-gray-400")} />
            <span className="font-bold text-sm">Add New Business</span>
          </Button>
          <Button
            className={cn(
              "h-16 px-8 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border-2",
              applicationType === 'edit'
                ? "bg-gradient-to-r from-primary to-blue-600 text-white border-transparent shadow-lg scale-105"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-blue-50/50"
            )}
            onClick={() => setApplicationType('edit')}
          >
            <Edit3 className={cn("h-5 w-5", applicationType === 'edit' ? "text-white" : "text-gray-400")} />
            <span className="font-bold text-sm">Edit Existing Business</span>
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={applicationType}
            initial={{ opacity: 0, x: applicationType === 'new' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: applicationType === 'new' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8">
                {applicationType === 'edit' && (
                  <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 relative z-50">
                    <Label className="text-blue-900 font-bold mb-3 block">Search & Select Your Business</Label>
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Start typing your business name..."
                          className={cn(
                            "pl-10 rounded-xl h-12 bg-white transition-all",
                            searchError && "border-red-500 ring-1 ring-red-500"
                          )}
                          value={businessSearch}
                          onChange={(e) => {
                            setBusinessSearch(e.target.value);
                            if (selectedBusinessId) setSelectedBusinessId("");
                            if (searchError) setSearchError("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              // Trigger error if not selected and something is typed
                              if (!selectedBusinessId && businessSearch.trim().length > 1) {
                                // If search finished and returned nothing, or we have no data at all
                                const hasNoResults = !isSearching && (!businessesData || businessesData.businesses.length === 0);
                                if (hasNoResults) {
                                  setSearchError("Sorry, the business does not exist");
                                }
                              }
                            }
                          }}
                        />
                        <AnimatePresence>
                          {searchError && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-600 text-sm mt-2 font-semibold flex items-center gap-1.5"
                            >
                              <span className="h-4 w-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">!</span>
                              {searchError}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {isSearching && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                          </div>
                        )}
                      </div>

                      {/* Dropdown Results */}
                      <AnimatePresence>
                        {applicationType === 'edit' && businessSearch.length > 1 && !selectedBusinessId && (businessesData?.businesses.length > 0 || isSearching) && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-2xl overflow-hidden z-[100]"
                          >
                            <div className="max-h-60 overflow-y-auto p-2">
                              {businessesData?.businesses.map((b: Business) => (
                                <button
                                  key={b.id}
                                  type="button"
                                  onClick={() => handleBusinessSelect(b)}
                                  className="w-full text-left p-3 hover:bg-blue-50 rounded-lg transition-colors group flex flex-col"
                                >
                                  <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">{b.business_name}</span>
                                  <span className="text-xs text-gray-500">{b.location}</span>
                                </button>
                              ))}
                              {!isSearching && businessesData?.businesses.length === 0 && (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                  No businesses found matching "{businessSearch}"
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {selectedBusinessId && (
                      <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Business selected. You can now modify the fields below.
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="business_name" className="text-gray-700 font-semibold">Business Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="business_name"
                        name="business_name"
                        required
                        placeholder="Enter business name"
                        value={formData.business_name}
                        onChange={handleInputChange}
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-gray-700 font-semibold">Location <span className="text-red-500">*</span></Label>
                      <Input
                        id="location"
                        name="location"
                        required
                        placeholder="e.g., 123 Main St, City, MD ZIP"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-700 font-semibold">Category <span className="text-red-500">*</span></Label>
                      <Select name="category" required value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="rounded-xl h-11">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_name" className="text-gray-700 font-semibold">Contact Person Name</Label>
                      <Input
                        id="contact_name"
                        name="contact_name"
                        placeholder="Enter contact person's name"
                        value={formData.contact_name}
                        onChange={handleInputChange}
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="tel" className="text-gray-700 font-semibold">Telephone <span className="text-red-500">*</span></Label>
                      <Input
                        id="tel"
                        name="tel"
                        type="tel"
                        required
                        placeholder="e.g., 410-555-1234"
                        value={formData.tel}
                        onChange={handleInputChange}
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="e.g., contact@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-gray-700 font-semibold">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="e.g., https://www.example.com"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_image" className="text-gray-700 font-semibold">Update Image</Label>
                      <Input id="business_image" name="business_image" type="file" accept="image/*" className="rounded-xl h-11 cursor-pointer" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 font-semibold">Business Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell us about your business"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="h-32 rounded-2xl resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t font-semibold">
                    <Button type="button" variant="ghost" className="rounded-xl h-12 px-8" onClick={() => navigate("/")}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || (applicationType === 'edit' && !selectedBusinessId)}
                      className="rounded-xl h-12 px-10 shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? "Submitting..." : applicationType === 'new' ? "Submit Request" : "Request Update"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default AddMyBusiness;

