
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const AddBusiness = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Business created",
        description: "The business has been successfully added",
      });
      navigate("/dashboard/businesses");
    }, 1000);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add New Business</h1>
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
                <Input id="business_name" required placeholder="Enter business name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                <Input id="location" required placeholder="e.g., 123 Main St, City, MD ZIP" />
              </div>
            </div>

            {/* Row 2: Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Input id="category" required placeholder="e.g., BOUTIQUES, Restaurants, Technology" />
              </div>
            </div>

            {/* Row 3: Contact Person Name & Telephone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Person Name</Label>
                <Input id="contact_name" placeholder="Enter contact person's name (optional)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tel">Telephone <span className="text-red-500">*</span></Label>
                <Input id="tel" type="tel" required placeholder="e.g., 410-555-1234" />
              </div>
            </div>

            {/* Row 4: Email Address & Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" required placeholder="e.g., contact@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" placeholder="e.g., https://www.example.com (optional)" />
              </div>
            </div>

            {/* Row 5: Business Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea 
                id="description" 
                placeholder="Tell us about your business (optional)" 
                className="h-32"
              />
            </div>

            {/* Row 6: Upload Image */}
            <div className="space-y-2">
              <div className="md:w-1/6">
                <Label htmlFor="business_image">Upload Image</Label>
                <Input id="business_image" type="file" accept="image/*" />
                <p className="text-xs text-muted-foreground">Upload an image (optional).</p>
              </div>
            </div>
            
            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/businesses")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Business"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBusiness;
