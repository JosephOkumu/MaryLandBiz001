import { useQuery } from "@tanstack/react-query";
import CategoryCard from "./CategoryCard";
import { getTopCategories, TopCategory } from "@/lib/api";
import { getCategoryIcon } from "@/lib/categoryIcons";

const Categories = () => {
  const {
    data: topCategories,
    isLoading,
    isError,
    error,
  } = useQuery<TopCategory[], Error>({
    queryKey: ["topCategories"],
    queryFn: () => getTopCategories(6),
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Explore Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Loading skeleton */}
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center animate-pulse"
              >
                <div className="mb-4 mx-auto w-10 h-10 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Explore Categories
          </h2>
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load categories</p>
            <p className="text-sm text-gray-500">{error?.message}</p>
          </div>
        </div>
      </section>
    );
  }

  const categoriesWithIcons =
    topCategories?.map((category) => ({
      icon: getCategoryIcon(category.category),
      name: category.category,
      count: category.business_count,
    })) || [];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Explore Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover businesses across various categories and find exactly what you're looking for
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categoriesWithIcons.map((category, index) => (
            <CategoryCard key={category.name} index={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
