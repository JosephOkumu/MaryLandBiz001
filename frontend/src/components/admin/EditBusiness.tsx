import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, Category, API_BASE_URL } from "@/lib/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { X } from 'lucide-react'; // Import X icon

const EditBusiness = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  useEffect(() => {
    const fetchBusinessData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/businesses/${id}`, {
          credentials: 'include', // Necessary for session cookies
        });
        const data = await response.json();
        if (response.ok) {
          setFormData(data);
        } else {
          navigate("/admin/businesses");
          toast({
            title: "Business not found",
            description: data.error || "The requested business could not be found",
            variant: "destructive",
          });
        }
      } catch (error) {
        navigate("/admin/businesses");
        toast({
          title: "Error",
          description: "Failed to fetch business data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBusinessData();
    }
  }, [id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('business_name', formData.business_name);
      submitData.append('location', formData.location);
      submitData.append('category', formData.category);
      submitData.append('contact_name', formData.contact_name || '');
      submitData.append('tel', formData.tel || '');
      submitData.append('email', formData.email || '');
      submitData.append('website', formData.website || '');
      submitData.append('description', formData.description || '');
      submitData.append('featured', String(formData.featured || false));

      // If a new file is selected, append it
      if (formData.business_image instanceof File) {
        submitData.append('business_image', formData.business_image);
      }

      const response = await fetch(`${API_BASE_URL}/api/businesses/${id}`, {
        method: 'PUT',
        credentials: 'include', // Necessary for session cookies
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Business updated",
          description: "The business has been successfully updated",
        });
        navigate("/admin/businesses");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update business. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | File | null) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading || isLoadingCategories) {
    return <div>Loading...</div>;
  }

  if (!formData) {
    return <div>Business not found</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Business</h1>
      </div>
      <Card className="relative pt-8"> {/* Added relative positioning and padding-top */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/admin/businesses")}
          title="Close"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Business Name & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name <span className="text-red-500">*</span></Label>
                <Input
                  id="business_name"
                  required
                  placeholder="Enter business name"
                  value={formData.business_name || ''}
                  onChange={(e) => handleChange("business_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                <Input
                  id="location"
                  required
                  placeholder="e.g., 123 Main St, City, MD ZIP"
                  value={formData.location || ''}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
            </div>

            {/* Row 2: Category & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Select
                  name="category"
                  value={formData.category || ''}
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                    {/* Fallback for existing category not in list */}
                    {formData.category && !categories?.some(c => c.name === formData.category) && (
                      <SelectItem value={formData.category}>
                        {formData.category}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={formData.status || 'active'}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Contact Person Name & Telephone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Person Name</Label>
                <Input
                  id="contact_name"
                  placeholder="Enter contact person's name (optional)"
                  value={formData.contact_name || ''}
                  onChange={(e) => handleChange("contact_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tel">Telephone <span className="text-red-500">*</span></Label>
                <Input
                  id="tel"
                  type="tel"
                  required
                  placeholder="e.g., 410-555-1234"
                  value={formData.tel || ''}
                  onChange={(e) => handleChange("tel", e.target.value)}
                />
              </div>
            </div>

            {/* Row 4: Email Address & Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="e.g., contact@example.com"
                  value={formData.email || ''}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="e.g., https://www.example.com (optional)"
                  value={formData.website || ''}
                  onChange={(e) => handleChange("website", e.target.value)}
                />
              </div>
            </div>

            {/* Row 5: Business Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your business (optional)"
                className="h-32"
                value={formData.description || ''}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* Row 6: Upload Image */}
            {/* Note: File input value is not controlled by React state in the same way. 
                Handling file uploads and pre-filling existing images requires more complex logic. */}
            <div className="space-y-2">
              <div className="md:w-1/6">
                <Label htmlFor="business_image">Upload Image</Label>
                <Input
                  id="business_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChange("business_image", e.target.files ? e.target.files[0] : null)}
                />
                <p className="text-xs text-muted-foreground">Upload new image to replace current one (optional).</p>

                {/* Show current image preview */}
                {formData.image_url && (
                  <div className="mt-3">
                    <p className="text-xs font-medium mb-2">Current Image:</p>
                    <div className="relative w-32 h-32 border rounded overflow-hidden bg-gray-50">
                      <img
                        src={`${API_BASE_URL}${formData.image_url}`}
                        alt="Current business"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/businesses")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Business"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBusiness;
