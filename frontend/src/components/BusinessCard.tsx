import { Card } from "@/components/ui/card";
import { Star, StarHalf, MapPin, Phone, Mail, Building2, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Business } from "@/lib/api";

// Category to icon mapping
const categoryIcons: Record<string, any> = {
  "BAKERY": Building2,
  "BANKS": Building2,
  "BARBER SHOPS": Building2,
  "BANQUET HALLS": Building2,
  "BAIL BOND": Building2,
  "BARS & LOUNGES": Building2,
  "BEAUTY ACADEMIES & SALONS": Building2,
  // Add more category mappings as needed
};

// Default fallback icon
const DefaultIcon = Building2;

interface BusinessCardProps {
  business: Business;
  index: number;
}

const BusinessCard = ({ business, index }: BusinessCardProps) => {
  // Get icon based on category or use default
  const IconComponent = categoryIcons[business.category] || DefaultIcon;
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      key={business.id}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="overflow-hidden shadow-md h-full flex flex-col group">
        <div className="flex justify-center items-center h-32 bg-primary/5 group-hover:bg-primary/10 transition-colors">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IconComponent className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </motion.div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold mb-2 text-primary group-hover:text-blue-600 transition-colors">
            {business.business_name}
          </h3>
          <span className="inline-block bg-background py-1 px-3 rounded text-xs mb-4 text-secondary">
            {business.category}
          </span>
          <p className="text-sm text-foreground mb-4 flex-1">
            {business.description || "No description available"}
          </p>
          
          {business.location && (
            <div className="flex items-center gap-2 text-sm mb-2 hover:text-primary transition-colors">
              <MapPin className="w-4 h-4 text-secondary" strokeWidth={2.5} />
              <span>{business.location}</span>
            </div>
          )}
          
          {business.tel && (
            <div className="flex items-center gap-2 text-sm mb-2 hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-secondary" strokeWidth={2.5} />
              <span>{business.tel}</span>
            </div>
          )}
          
          {business.email && (
            <div className="flex items-center gap-2 text-sm mb-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4 text-secondary" strokeWidth={2.5} />
              <span>{business.email}</span>
            </div>
          )}
          
          {business.website && (
            <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <Globe className="w-4 h-4 text-secondary" strokeWidth={2.5} />
              <a 
                href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default BusinessCard;
