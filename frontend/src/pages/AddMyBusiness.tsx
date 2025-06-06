
import { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const newApplicationData: NewBusinessApplication = {
      id: `app_${Date.now()}`,
      businessName: formData.get('business_name') as string,
      location: formData.get('location') as string,
      category: formData.get('category') as string,
      contactName: formData.get('contact_name') as string || undefined,
      tel: formData.get('tel') as string,
      email: formData.get('email') as string,
      website: formData.get('website') as string || undefined,
      description: formData.get('description') as string || undefined,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      isNew: true,
    };

    try {
      const existingApplicationsJSON = localStorage.getItem('businessApplications');
      const existingApplications: NewBusinessApplication[] = existingApplicationsJSON ? JSON.parse(existingApplicationsJSON) : [];
      existingApplications.push(newApplicationData);
      localStorage.setItem('businessApplications', JSON.stringify(existingApplications));
      
      // Dispatch an event that other components (header, sidebar, applications page) can listen to
      window.dispatchEvent(new CustomEvent('localStorageUpdated'));
      // localStorage.setItem('newAdminNotification', 'true'); // Optional: general flag

      setTimeout(() => {
        setIsSubmitting(false);
        toast({
          title: "Request Submitted",
          description: "We've received your business request. Our team will review it shortly.",
        });
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error saving application to localStorage:", error);
      setIsSubmitting(false);
      toast({
        title: "Submission Error",
        description: "Could not save your request. Please try again.",
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
                  <Input id="category" name="category" required placeholder="e.g., BOUTIQUES, Restaurants, Technology" />
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
