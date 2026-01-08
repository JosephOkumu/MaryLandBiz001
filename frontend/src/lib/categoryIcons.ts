import { LucideIcon } from "lucide-react";
import {
  Briefcase,
  HardHat,
  Heart,
  Utensils,
  ShoppingBag,
  Scissors,
  Truck,
  Home,
  Laptop,
  DollarSign,
  GraduationCap,
  Music,
  Users,
  Scale,
  Camera,
  Car,
  Church,
  Baby,
  UserCheck,
  Shield,
  Leaf,
  Building,
  PawPrint,
  Cross,
  Flower,
  Building2
} from "lucide-react";

// Define the mapping of category names to Lucide icons
const categoryIconMap: Record<string, LucideIcon> = {
  "Professional Services": Briefcase,
  "Construction & Contractors": HardHat,
  "Healthcare & Medical": Heart,
  "Food & Dining": Utensils,
  "Retail & Shopping": ShoppingBag,
  "Beauty & Personal Care": Scissors,
  "Transportation Services": Truck,
  "Home & Property Services": Home,
  "Technology Services": Laptop,
  "Financial Services": DollarSign,
  "Education & Training": GraduationCap,
  "Entertainment & Events": Music,
  "Community & Nonprofit": Users,
  "Legal Services": Scale,
  "Media & Creative": Camera,
  "Automotive Services": Car,
  "Religious Organizations": Church,
  "Childcare & Family Services": Baby,
  "Employment Services": UserCheck,
  "Security Services": Shield,
  "Environmental Services": Leaf,
  "Engineering & Architecture": Building,
  "Pet Services": PawPrint,
  "Funeral Services": Cross,
  "Government": Building2,
};

// Default icon for categories not found in the mapping
const DEFAULT_ICON = Briefcase;

/**
 * Get the appropriate Lucide icon for a given category name
 * @param categoryName - The name of the category
 * @returns The corresponding Lucide icon component
 */
export const getCategoryIcon = (categoryName: string): LucideIcon => {
  return categoryIconMap[categoryName] || DEFAULT_ICON;
};

/**
 * Get all available category icons
 * @returns Object with all category-icon mappings
 */
export const getAllCategoryIcons = (): Record<string, LucideIcon> => {
  return categoryIconMap;
};

/**
 * Check if a category has a specific icon mapped
 * @param categoryName - The name of the category
 * @returns Boolean indicating if the category has an icon
 */
export const hasCategoryIcon = (categoryName: string): boolean => {
  return categoryName in categoryIconMap;
};
