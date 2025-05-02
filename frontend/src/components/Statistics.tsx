
import { Card } from "@/components/ui/card";
import { Star, StarHalf, MapPin, Phone, Computer, Utensils, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const businesses = [
  { 
    name: "Chesapeake Tech Solutions", 
    category: "Technology",
    description: "Providing cutting-edge technology solutions for businesses across Maryland with expertise in cloud computing, cybersecurity, and IT consulting.",
    location: "Baltimore, MD",
    phone: "(410) 555-8765",
    rating: 4.5,
    icon: Computer
  },
  { 
    name: "Harbor View Restaurant", 
    category: "Restaurants",
    description: "Upscale dining with fresh seafood and incredible views of the Chesapeake Bay. Perfect for special occasions and corporate events.",
    location: "Annapolis, MD",
    phone: "(443) 555-3492",
    rating: 4.9,
    icon: Utensils
  },
  { 
    name: "Blue Ridge Builders", 
    category: "Construction",
    description: "Family-owned construction company specializing in custom homes, renovations, and commercial building projects with over 25 years of experience.",
    location: "Frederick, MD",
    phone: "(301) 555-7621",
    rating: 4.0,
    icon: Wrench
  }
];

const Statistics = () => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="text-amber-400 w-4 h-4 fill-amber-400" strokeWidth={2.5} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="text-amber-400 w-4 h-4 fill-amber-400" strokeWidth={2.5} />);
    }
    
    return stars;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-12 text-primary"
        >
          Featured Businesses
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {businesses.map((business, index) => {
            const IconComponent = business.icon;
            return (
              <motion.div
                key={business.name}
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
                      {business.name}
                    </h3>
                    <span className="inline-block bg-background py-1 px-3 rounded text-xs mb-4 text-secondary">
                      {business.category}
                    </span>
                    <p className="text-sm text-foreground mb-4 flex-1">
                      {business.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm mb-2 hover:text-primary transition-colors">
                      <MapPin className="w-4 h-4 text-secondary" strokeWidth={2.5} />
                      <span>{business.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Phone className="w-4 h-4 text-secondary" strokeWidth={2.5} />
                      <span>{business.phone}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
