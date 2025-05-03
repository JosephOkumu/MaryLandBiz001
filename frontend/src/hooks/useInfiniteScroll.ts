import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Distance from bottom to trigger loading (in pixels)
  initialLoad?: boolean; // Whether to load data on component mount
}

export default function useInfiniteScroll({
  threshold = 200,
  initialLoad = true
}: UseInfiniteScrollOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const [page, setPage] = useState(0);

  const onScroll = useCallback(() => {
    if (loading || end) return;
    
    const scrollTop = 
      (document.documentElement && document.documentElement.scrollTop) || 
      document.body.scrollTop;
    const scrollHeight = 
      (document.documentElement && document.documentElement.scrollHeight) || 
      document.body.scrollHeight;
    const clientHeight = 
      document.documentElement.clientHeight || window.innerHeight;
    
    // Check if user has scrolled to bottom threshold
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      setLoading(true);
    }
  }, [loading, end, threshold]);

  // Load next page handler
  const loadMore = useCallback(() => {
    if (!loading) return;
    setPage(prevPage => prevPage + 1);
  }, [loading]);

  useEffect(() => {
    if (loading) {
      loadMore();
    }
  }, [loading, loadMore]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  // Handle initial load if enabled
  useEffect(() => {
    if (initialLoad) {
      setLoading(true);
    }
  }, [initialLoad]);

  const reset = useCallback(() => {
    setPage(0);
    setEnd(false);
  }, []);

  return {
    loading,
    setLoading,
    page,
    setEnd,
    reset
  };
}
