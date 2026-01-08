
import { Building, Home, Search, PlusCircle, Menu, X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBrowseClick = () => {
    if (window.location.pathname === '/') {
      const searchInput = document.getElementById('hero-search-input');
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Adding a slight delay for focus to ensure scroll has finished
        setTimeout(() => {
          searchInput.focus({ preventScroll: true });
        }, 300); // Adjust delay if needed
      }
    } else {
      // Navigate to homepage with a query param to trigger focus/scroll
      navigate('/?focusSearch=true');
    }
  };

  const navItemVariants = {
    hover: {
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-white via-blue-50/30 to-white backdrop-blur-sm shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Building className="h-6 w-6 md:h-8 md:w-8 text-primary" strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl md:text-2xl font-bold">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[#0061A8]"
              >
                Maryland
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-secondary"
              >
                Biz
              </motion.span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block ml-auto">
            <ul className="flex items-center space-x-4">
              <motion.li variants={navItemVariants} whileHover="hover">
                <Link to="/" className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                  <Home className="h-4 w-4" strokeWidth={2.5} />
                  <span>Home</span>
                </Link>
              </motion.li>
              <motion.li variants={navItemVariants} whileHover="hover">
                <button onClick={handleBrowseClick} className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                  <Search className="h-4 w-4" strokeWidth={2.5} />
                  <span>Browse</span>
                </button>
              </motion.li>
              <motion.li variants={navItemVariants} whileHover="hover">
                <Link to="/add-my-business" className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                  <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
                  <span>Add Business</span>
                </Link>
              </motion.li>
              <motion.li variants={navItemVariants} whileHover="hover">
                <Link to="/contact" className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                  <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
                  <span>Contact</span>
                </Link>
              </motion.li>

            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t"
          >
            <ul className="flex flex-col space-y-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 rounded-lg transition-all shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="h-5 w-5" strokeWidth={2.5} />
                  <span className="font-medium text-base">Home</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleBrowseClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 text-white hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 rounded-lg transition-all shadow-sm text-left"
                >
                  <Search className="h-5 w-5" strokeWidth={2.5} />
                  <span className="font-medium text-base">Browse</span>
                </button>
              </li>
              <li>
                <Link
                  to="/add-my-business"
                  className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 rounded-lg transition-all shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PlusCircle className="h-5 w-5" strokeWidth={2.5} />
                  <span className="font-medium text-base">Add Business</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 rounded-lg transition-all shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
                  <span className="font-medium text-base">Contact</span>
                </Link>
              </li>

            </ul>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
