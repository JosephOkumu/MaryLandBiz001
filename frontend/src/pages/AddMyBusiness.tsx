import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, Category, API_BASE_URL } from "@/lib/api";
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
import { motion } from "framer-motion";

// Interface for new business applications (should match ApplicationsPage.tsx)
interface NewBusinessApplication {
  id: string;
  businessName: string;
  location: string;
  category: string;
  contactName?: string;
  tel: string;
  email: string;
  website?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  isNew: boolean;
}

const AddMyBusiness = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Rename form fields to match backend expectations
    const submitData = new FormData();
    submitData.append('businessName', formData.get('business_name') as string);
    submitData.append('location', formData.get('location') as string);
    submitData.append('category', formData.get('category') as string);
    submitData.append('contactName', formData.get('contact_name') as string || '');
    submitData.append('tel', formData.get('tel') as string);
    submitData.append('email', formData.get('email') as string);
    submitData.append('website', formData.get('website') as string || '');
    submitData.append('description', formData.get('description') as string || '');

    // Add the image file if present
    const imageFile = formData.get('business_image') as File;
    if (imageFile && imageFile.size > 0) {
      submitData.append('business_image', imageFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/business-applications`, {
        method: 'POST',
        // Don't set Content-Type header - browser will set it automatically with boundary for multipart/form-data
        body: submitData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTimeout(() => {
        setIsSubmitting(false);
        toast({
          title: "Request Submitted",
          description: "We've received your business request. Our team will review it shortly.",
        });
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setIsSubmitting(false);
      toast({
        title: "Submission Error",
        description: "Could not submit your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const inputAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-8 flex-grow">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6"
        >
          Request to Add Your Business
        </motion.h1>
        <Card>
          <CardContent className="pt-6">
            <motion.form
              variants={formAnimation}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <motion.div variants={inputAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name <span className="text-red-500">*</span></Label>
                  <Input id="business_name" name="business_name" required placeholder="Enter business name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Input id="location" name="location" required placeholder="e.g., 123 Main St, City, MD ZIP" />
                </div>
              </motion.div>

              <motion.div variants={inputAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select name="category" required onValueChange={setSelectedCategory}>
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
                  {/* Fallback hidden input if Select doesn't render one compatible with FormData in this version */}
                  <input type="hidden" name="category" value={selectedCategory} />
                </div>
              </motion.div>

              <motion.div variants={inputAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Contact Person Name</Label>
                  <Input id="contact_name" name="contact_name" placeholder="Enter contact person's name (optional)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tel">Telephone <span className="text-red-500">*</span></Label>
                  <Input id="tel" name="tel" type="tel" required placeholder="e.g., 410-555-1234" />
                </div>
              </motion.div>

              <motion.div variants={inputAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input id="email" name="email" type="email" required placeholder="e.g., contact@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" type="url" placeholder="e.g., https://www.example.com (optional)" />
                </div>
              </motion.div>

              <motion.div variants={inputAnimation} className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description" name="description"
                  placeholder="Tell us about your business (optional)"
                  className="h-32"
                />
              </motion.div>

              <motion.div variants={inputAnimation} className="space-y-2">
                <div className="md:w-1/6">
                  <Label htmlFor="business_image">Upload Image</Label>
                  <Input id="business_image" name="business_image" type="file" accept="image/*" />
                  <p className="text-xs text-muted-foreground">Upload an image for your business listing (optional).</p>
                </div>
              </motion.div>

              <motion.div
                variants={inputAnimation}
                className="flex justify-end gap-2"
                whileHover={{ scale: 1.01 }}
              >
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AddMyBusiness;
