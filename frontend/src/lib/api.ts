// Define the Business type
export type Business = {
  id: string; // or number, depending on your DB's primary key type for businesses
  business_name: string;
  category: string | null;
  location: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  tel?: string | null; // Added for flexibility if source data uses 'tel'
  contact_email: string | null;
  website: string | null;
  description: string | null;
  status: "pending" | "approved" | "rejected" | string; // string for flexibility if other statuses exist
  featured?: boolean; // Assuming featured is optional or might not always be present
  created_at: string; // Assuming ISO date string
  updated_at: string; // Assuming ISO date string
};

// Define the Category type
// Define the Admin User type (matches backend response)
export type AdminUser = {
  id: number;
  username: string;
};

// Define credentials for admin login
export type AdminLoginCredentials = {
  username: string;
  password: string;
};

// Define the expected response structure for auth check
export type AdminAuthResponse = {
  is_authenticated: boolean;
  user?: AdminUser;
  message?: string; // For error messages or unauthorized
};

export type Category = {
  id: string; // Or number, depending on your DB schema
  name: string;
};

export type TopCategory = {
  category: string;
  business_count: number;
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

  const response = await fetch(
    `http://localhost:5000/api/businesses?${params.toString()}`,
  );
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({
        message: "Failed to fetch businesses and could not parse error",
      }));
    throw new Error(errorData.message || "Failed to fetch businesses");
  }
  return await response.json();
};

// Fetch all categories from the backend
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`http://localhost:5000/api/categories`);
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({
        message: "Failed to fetch categories and could not parse error",
      }));
    throw new Error(errorData.message || "Failed to fetch categories");
  }
  return await response.json();
};

// Fetch top categories by business count from the backend
export const getTopCategories = async (
  limit: number = 6,
): Promise<TopCategory[]> => {
  const response = await fetch(
    `http://localhost:5000/api/categories/top?limit=${limit}`,
  );
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({
        message: "Failed to fetch top categories and could not parse error",
      }));
    throw new Error(errorData.message || "Failed to fetch top categories");
  }
  return await response.json();
};

// Fetch featured businesses from the backend
export const getFeaturedBusinesses = async (limit: number) => {
  const response = await fetch(
    `http://localhost:5000/api/businesses/featured?limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch featured businesses");
  }
  return await response.json();
};

// Fetch new businesses count from the backend
export const getNewBusinessesCount = async (): Promise<number> => {
  const response = await fetch(
    "http://localhost:5000/api/businesses/new-count",
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch new businesses count");
  }

  const data = await response.json();
  return data.count;
};

// Function to fetch business applications
export async function getBusinessApplications(): Promise<any[]> {
  const response = await fetch(
    "http://localhost:5000/api/business-applications",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// --- Admin Authentication API Functions ---

const ADMIN_API_BASE_URL = "http://localhost:5000/api/admin";

export const adminLogin = async (
  credentials: AdminLoginCredentials,
): Promise<{ message: string; user: AdminUser }> => {
  const response = await fetch(`${ADMIN_API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include", // IMPORTANT: For sending/receiving session cookies
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Admin login failed");
  }
  return data;
};

export const adminLogout = async (): Promise<{ message: string }> => {
  const response = await fetch(`${ADMIN_API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include", // IMPORTANT: For sending/receiving session cookies
  });
  const data = await response.json();
  if (!response.ok) {
    // Even if logout fails on server, we might want to clear client state
    console.error("Admin logout failed on server:", data.error);
    throw new Error(data.error || "Admin logout failed");
  }
  return data;
};

export const checkAdminAuth = async (): Promise<AdminAuthResponse> => {
  const response = await fetch(`${ADMIN_API_BASE_URL}/authcheck`, {
    method: "GET",
    credentials: "include", // IMPORTANT: For sending/receiving session cookies
  });
  // For authcheck, a 401 is an expected 'not authenticated' response, not necessarily an error to throw
  if (response.status === 401) {
    const data = await response
      .json()
      .catch(() => ({
        is_authenticated: false,
        message: "Session expired or not authenticated",
      }));
    return { is_authenticated: false, message: data.message };
  }
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to check admin auth status" }));
    throw new Error(errorData.message || "Failed to check admin auth status");
  }
  return await response.json(); // Should be { is_authenticated: true, user: AdminUser }
};
