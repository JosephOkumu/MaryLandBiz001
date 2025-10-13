
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  icon: LucideIcon;
  name: string;
  count: number;
  index?: number;
}

const CategoryCard = ({ icon: Icon, name, count, index = 0 }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        delay: index * 0.15,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.08,
        y: -8
      }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center border border-gray-100 transition-all duration-300 cursor-pointer overflow-hidden relative"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <motion.div 
        className="mb-6 text-primary relative z-10"
        whileHover={{ rotate: 12, scale: 1.2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
          <Icon className="w-8 h-8" strokeWidth={2.5} />
        </div>
      </motion.div>
      
      <div className="relative z-10">
        <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-primary transition-colors duration-300">{name}</h3>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-secondary rounded-full"></div>
          <p className="text-lg font-semibold text-secondary">{count} Businesses</p>
          <div className="w-2 h-2 bg-secondary rounded-full"></div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-8 h-8 border-2 border-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-2 border-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default CategoryCard;
