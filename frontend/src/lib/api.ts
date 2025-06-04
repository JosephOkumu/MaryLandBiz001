// Define the Business type
export type Business = {
  id: string;
  name: string;
  category: string;
  description: string;
  featured: boolean;
};

// Define the Category type
export type Category = {
  id: string; // Or number, depending on your DB schema
  name: string;
};

// Fetch businesses from the backend
export const getBusinesses = async ({
  limit,
  offset,
  category,
  q,
}: {
  limit: number;
  offset: number;
  category?: string;
  q?: string;
}) => {
  const params = new URLSearchParams();
  params.append("limit", String(limit));
  params.append("offset", String(offset));
  if (category) {
    params.append("category", category);
  }
  if (q) {
    params.append("q", q);
  }

  const response = await fetch(`http://localhost:5000/api/businesses?${params.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch businesses and could not parse error" }));
    throw new Error(errorData.message || "Failed to fetch businesses");
  }
  return await response.json();
};

// Fetch all categories from the backend
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`http://localhost:5000/api/categories`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch categories and could not parse error" }));
    throw new Error(errorData.message || "Failed to fetch categories");
  }
  return await response.json();
};

// Fetch featured businesses from the backend
export const getFeaturedBusinesses = async (limit: number) => {
  const response = await fetch(`http://localhost:5000/api/businesses/featured?limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch featured businesses");
  }
  return await response.json();
};