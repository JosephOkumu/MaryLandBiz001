
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

// Mock data for the selected business
const businessData = {
  "1": { 
    name: "Chesapeake Tech Solutions", 
    category: "technology",
    description: "Providing cutting-edge technology solutions for businesses across Maryland with expertise in cloud computing, cybersecurity, and IT consulting.",
    city: "Baltimore",
    state: "Maryland",
    phone: "(410) 555-8765",
    email: "info@chesapeaketech.com",
    website: "https://chesapeaketech.com",
    status: "active"
  },
  "2": { 
    name: "Harbor View Restaurant", 
    category: "restaurants",
    description: "Upscale dining with fresh seafood and incredible views of the Chesapeake Bay. Perfect for special occasions and corporate events.",
    city: "Annapolis",
    state: "Maryland",
    phone: "(443) 555-3492",
    email: "reservations@harborview.com",
    website: "https://harborviewmd.com",
    status: "active"
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

  const handleChange = (field: string, value: string) => {
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
      <h1 className="text-2xl font-bold">Edit Business</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input 
                  id="name" 
                  required 
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurants">Restaurants</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="professional">Professional Services</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  required 
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  required 
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  required 
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                className="h-32"
                required
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Business Image</Label>
              <Input id="image" type="file" accept="image/*" />
              {/* If there's an existing image, you might want to show it here */}
              <p className="text-sm text-muted-foreground mt-2">
                Leave empty to keep the current image
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/businesses")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBusiness;
