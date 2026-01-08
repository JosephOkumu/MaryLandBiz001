import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, Category } from "@/lib/api";
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
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const [formData, setFormData] = useState({
    business_name: '',
    location: '',
    category: '',
    contact_name: '',
    tel: '',
    email: '',
    website: '',
    description: '',
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Necessary for session cookies if using Flask-Login
        body: JSON.stringify({
          business_name: formData.business_name,
          location: formData.location,
          category: formData.category,
          contact_name: formData.contact_name,
          tel: formData.tel,
          email: formData.email,
          website: formData.website,
          description: formData.description
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Business added successfully!",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add business. Please try again.",
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

  const handleClose = () => {
    navigate('/dashboard');
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
          onClick={handleClose}
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
                <Input id="business_name" required name="business_name" value={formData.business_name} onChange={handleChange} placeholder="Enter business name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                <Input id="location" required name="location" value={formData.location} onChange={handleChange} placeholder="e.g., 123 Main St, City, MD ZIP" />
              </div>
            </div>

            {/* Row 2: Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Select
                  name="category"
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Contact Person Name & Telephone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Person Name</Label>
                <Input id="contact_name" name="contact_name" value={formData.contact_name} onChange={handleChange} placeholder="Enter contact person's name (optional)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tel">Telephone <span className="text-red-500">*</span></Label>
                <Input id="tel" type="tel" required name="tel" value={formData.tel} onChange={handleChange} placeholder="e.g., 410-555-1234" />
              </div>
            </div>

            {/* Row 4: Email Address & Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" required name="email" value={formData.email} onChange={handleChange} placeholder="e.g., contact@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" name="website" value={formData.website} onChange={handleChange} placeholder="e.g., https://www.example.com (optional)" />
              </div>
            </div>

            {/* Row 5: Business Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your business (optional)"
                className="h-32"
              />
            </div>

            {/* Row 6: Upload Image */}
            <div className="space-y-2">
              <div className="md:w-1/6">
                <Label htmlFor="business_image">Upload Image</Label>
                <Input id="business_image" type="file" onChange={handleImageChange} accept="image/*" />
                <p className="text-xs text-muted-foreground">Upload an image (optional).</p>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
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
