import { useEffect, useRef, Fragment } from "react";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom"; // Added
import BusinessCard from "./BusinessCard";
import { Business, getBusinesses } from "../lib/api";

const PAGE_SIZE = 75;

// Updated fetchBusinesses to accept q and category
const fetchBusinesses = async ({
  pageParam = 0,
  q,
  category,
}: {
  pageParam?: number;
  q: string;
  category: string;
}) => {
  const result = await getBusinesses({ limit: PAGE_SIZE, offset: pageParam, q, category });
  return { ...result, nextPageOffset: pageParam + result.businesses.length };
};

const Statistics = () => {
  const [searchParams] = useSearchParams();
  const queryParamQ = searchParams.get("q") || "";
  const queryParamCategory = searchParams.get("category") || "";
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['businesses', queryParamCategory, queryParamQ], // Updated queryKey
    queryFn: ({ pageParam }) =>
      fetchBusinesses({ pageParam, q: queryParamQ, category: queryParamCategory }), // Pass q and category
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
        rootMargin: "0px 0px 1200px 0px", // Trigger when sentinel is 1200px from bottom of viewport
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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            {queryParamQ || queryParamCategory ? "Search Results" : "Featured Businesses"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            {queryParamQ || queryParamCategory
              ? "Discover businesses that match your search criteria"
              : "Explore our curated selection of Maryland's finest businesses"}
          </motion.p>
        </div>

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
            <p className="text-lg text-gray-500">
              {queryParamQ || queryParamCategory
                ? "No businesses found matching your criteria."
                : "No businesses found."}
            </p>
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

// Helper to keep track of previous search params for comparison if needed for more complex scenarios
// Not strictly necessary for this implementation but can be useful.
// const usePrevious = <T extends unknown>(value: T): T | undefined => {
//   const ref = useRef<T>();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// };

