
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Categories from "@/components/Categories"
import Statistics from "@/components/Statistics"
import Footer from "@/components/Footer"
import AnimatedPage from "@/components/AnimatedPage";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('focusSearch') === 'true') {
      const searchInput = document.getElementById('hero-search-input');
      if (searchInput) {
        // Ensure Hero component might take a moment to render fully
        setTimeout(() => {
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            searchInput.focus({ preventScroll: true });
          }, 300); // Delay for focus after scroll
          // Clean up URL
          navigate('/', { replace: true });
        }, 100); // Small delay to ensure DOM is ready, adjust if needed
      }
    }
  }, [location.search, navigate]);

  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Hero />
        <Categories />
        <Statistics />
        <Footer />
      </div>
    </AnimatedPage>
  )
}

export default Index
