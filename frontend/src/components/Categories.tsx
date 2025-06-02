
import { Utensils, ShoppingBag, Briefcase, Heart, HardHat, Laptop } from "lucide-react";
import CategoryCard from "./CategoryCard";

const categories = [
  { icon: Utensils, name: "Restaurants", count: 238 },
  { icon: ShoppingBag, name: "Retail", count: 412 },
  { icon: Briefcase, name: "Professional Services", count: 183 },
  { icon: Heart, name: "Healthcare", count: 156 },
  { icon: HardHat, name: "Construction", count: 98 },
  { icon: Laptop, name: "Technology", count: 124 },
];

const Categories = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">
          Explore Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.name} 
              index={index}
              {...category} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
