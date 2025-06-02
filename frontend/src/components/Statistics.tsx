import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BusinessCard from "./BusinessCard";
import { Business, getBusinesses, getFeaturedBusinesses } from "@/lib/api";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

const Statistics = () => {
  // State for featured businesses from the database
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const PAGE_SIZE = 12; // Display 12 businesses per page
  
  // Use our custom infinite scroll hook
  const { loading, setLoading, page, setEnd, reset } = useInfiniteScroll({
    threshold: 200, // Load more when user scrolls within 200px of the bottom
    initialLoad: true
  });

  // Fetch featured businesses on component mount
  useEffect(() => {
    const fetchInitialBusinesses = async () => {
      try {
        const featuredData = await getFeaturedBusinesses(PAGE_SIZE);
        setBusinesses(featuredData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching featured businesses:", error);
        setLoading(false);
      }
    };

    fetchInitialBusinesses();
  }, []);

  // Load more businesses when user scrolls (infinite scroll)
  useEffect(() => {
    if (page === 0) return; // Skip on initial render
    
    const loadMoreBusinesses = async () => {
      try {
        const offset = page * PAGE_SIZE;
        const result = await getBusinesses({
          limit: PAGE_SIZE,
          offset
        });
        
        if (result.businesses.length === 0) {
          setEnd(true);
        } else {
          setBusinesses(prevBusinesses => [...prevBusinesses, ...result.businesses]);
          setTotalBusinesses(result.total);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading more businesses:", error);
        setLoading(false);
      }
    };

    loadMoreBusinesses();
  }, [page, setLoading, setEnd]);

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
        
        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {businesses.map((business, index) => (
              <BusinessCard 
                key={business.id || index}
                business={business}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">Loading businesses...</p>
          </div>
        )}
        
        {loading && businesses.length > 0 && (
          <div className="text-center mt-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Loading more businesses...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Statistics;
