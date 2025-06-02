
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

const AddMyBusiness = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending message to admin
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Request Submitted",
        description: "We've received your business request. Our team will review it shortly.",
      });
      navigate("/");
    }, 1000);
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
              <motion.div variants={inputAnimation} className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" required placeholder="Enter your business name" />
              </motion.div>

              <motion.div variants={inputAnimation} className="space-y-2">
                <Label htmlFor="category">Business Category</Label>
                <Input id="category" required placeholder="e.g., Restaurant, Retail, Technology" />
              </motion.div>

              <motion.div variants={inputAnimation} className="space-y-2">
                <Label htmlFor="contact">Contact Information</Label>
                <Input id="contact" type="email" required placeholder="Your email address" />
              </motion.div>

              <motion.div variants={inputAnimation} className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please describe your business..." 
                  className="h-32"
                  required
                />
              </motion.div>

              <motion.div variants={inputAnimation} className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea 
                  id="message" 
                  placeholder="Any additional information you'd like to share..." 
                  className="h-24"
                />
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
