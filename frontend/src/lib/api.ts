// Define the Business type
export type Business = {
  id: string;
  name: string;
  category: string;
  description: string;
  featured: boolean;
};

// Fetch businesses from the backend
export const getBusinesses = async ({ limit, offset }: { limit: number; offset: number }) => {
  const response = await fetch(`http://localhost:5000/api/businesses?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error("Failed to fetch businesses");
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