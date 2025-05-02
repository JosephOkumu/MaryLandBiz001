
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
      }}
      className="bg-white rounded-lg shadow-md p-6 text-center"
    >
      <motion.div 
        className="mb-4 text-primary"
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="w-10 h-10 mx-auto" strokeWidth={2.5} />
      </motion.div>
      <h3 className="font-semibold text-lg mb-2">{name}</h3>
      <p className="text-sm text-secondary">{count} Businesses</p>
    </motion.div>
  );
};

export default CategoryCard;
