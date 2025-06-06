
import { useState, useEffect } from "react";
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

// Mock data for the selected business - Updated structure
const businessData: { [key: string]: any } = {
  "1": { 
    business_name: "Chesapeake Tech Solutions", 
    location: "Baltimore, MD",
    category: "Technology",
    contact_name: "Jane Doe",
    tel: "(410) 555-8765",
    email: "info@chesapeaketech.com",
    website: "https://chesapeaketech.com",
    description: "Providing cutting-edge technology solutions for businesses across Maryland with expertise in cloud computing, cybersecurity, and IT consulting.",
    status: "active",
    business_image: "" // Placeholder for image path/data
  },
  "2": { 
    business_name: "Harbor View Restaurant", 
    location: "Annapolis, MD",
    category: "Restaurants",
    contact_name: "John Smith",
    tel: "(443) 555-3492",
    email: "reservations@harborview.com",
    website: "https://harborviewmd.com",
    description: "Upscale dining with fresh seafood and incredible views of the Chesapeake Bay. Perfect for special occasions and corporate events.",
    status: "active",
    business_image: ""
  },
};

const EditBusiness = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, you would fetch the data from an API
    if (id && businessData[id as keyof typeof businessData]) {
      setFormData(businessData[id as keyof typeof businessData]);
    } else {
      navigate("/dashboard/businesses");
      toast({
        title: "Business not found",
        description: "The requested business could not be found",
        variant: "destructive",
      });
    }
  }, [id, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Business updated",
        description: "The business has been successfully updated",
      });
      navigate("/dashboard/businesses");
    }, 1000);
  };

  const handleChange = (field: string, value: string | File | null) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  if (!formData) {
    return <div>Loading...</div>;
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
          onClick={() => navigate("/dashboard/businesses")}
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
                <Input 
                  id="category" 
                  required 
                  placeholder="e.g., BOUTIQUES, Restaurants, Technology"
                  value={formData.category || ''}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
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
                <p className="text-xs text-muted-foreground">Upload new image (optional).</p>
                {formData.business_image && typeof formData.business_image === 'string' && formData.business_image !== '' && (
                  <p className="text-xs text-muted-foreground mt-1">Current image: {formData.business_image}</p>
                )}
              </div>
            </div>
            
            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/businesses")}>
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
