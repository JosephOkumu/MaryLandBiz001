import { useEffect, useRef, Fragment } from "react";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import BusinessCard from "./BusinessCard";
import { Business, getBusinesses } from "../lib/api";

const PAGE_SIZE = 150;

const fetchBusinesses = async ({ pageParam = 0 }: { pageParam?: number }) => {
  // pageParam here is the offset
  const result = await getBusinesses({ limit: PAGE_SIZE, offset: pageParam });
  return { ...result, nextPageOffset: pageParam + result.businesses.length };
};

const Statistics = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['businesses'],
    queryFn: ({ pageParam }) => fetchBusinesses({ pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPageOffset >= lastPage.total) {
        return undefined; // No more pages
      }
      return lastPage.nextPageOffset;
    },
    initialPageParam: 0,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "0px 0px 500px 0px", // Trigger when sentinel is 500px from bottom of viewport
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container text-center py-10">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="text-lg text-gray-500 mt-4">Loading businesses...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-white">
        <div className="container text-center py-10">
          <p className="text-lg text-red-500">Error fetching businesses: {(error as Error)?.message || 'Unknown error'}</p>
        </div>
      </section>
    );
  }

  const allBusinesses = data?.pages.flatMap((page: { businesses: Business[], total: number, nextPageOffset: number }) => page.businesses) || [];

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
        
        {allBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {allBusinesses.map((business, index) => (
              <BusinessCard 
                key={business.id || index} // Ensure unique key
                business={business}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">No businesses found.</p>
          </div>
        )}
        
        <div ref={loadMoreRef} style={{ height: '1px' }} /> {/* Sentinel for IntersectionObserver */}

        {isFetchingNextPage && (
          <div className="text-center mt-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Loading more businesses...</p>
          </div>
        )}

        {!hasNextPage && allBusinesses.length > 0 && (
           <div className="text-center mt-8">
            <p className="text-sm text-gray-500">You've reached the end of the list.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Statistics;
