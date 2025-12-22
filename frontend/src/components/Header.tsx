
import { Building, Home, Search, PlusCircle, User, Menu, X } from "lucide-react";
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
      className="sticky top-0 z-50 w-full border-b bg-white shadow-md"
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
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-1 lg:space-x-4">
              <motion.li variants={navItemVariants} whileHover="hover">
                <Link to="/" className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 hover:text-primary rounded-md transition-all">
                  <Home className="h-4 w-4" strokeWidth={2.5} />
                  <span className="font-medium">Home</span>
                </Link>
              </motion.li>
              <motion.li variants={navItemVariants} whileHover="hover">
                <button onClick={handleBrowseClick} className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 hover:text-primary rounded-md transition-all">
                  <Search className="h-4 w-4" strokeWidth={2.5} />
                  <span className="font-medium">Browse</span>
                </button>
              </motion.li>
              <motion.li variants={navItemVariants} whileHover="hover">
                <Link to="/add-my-business" className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 hover:text-primary rounded-md transition-all">
                  <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
                  <span className="font-medium">Add My Business</span>
                </Link>
              </motion.li>
              <motion.li variants={navItemVariants} whileHover="hover">
                <Link to="/admin" className="flex items-center gap-2 px-3 py-2 bg-primary text-white hover:bg-primary/90 rounded-md transition-all">
                  <User className="h-4 w-4" strokeWidth={2.5} />
                  <span className="font-medium">Admin</span>
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
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium text-lg">Home</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleBrowseClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 hover:text-primary rounded-lg transition-all text-left"
                >
                  <Search className="h-5 w-5" />
                  <span className="font-medium text-lg">Browse</span>
                </button>
              </li>
              <li>
                <Link
                  to="/add-my-business"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PlusCircle className="h-5 w-5" />
                  <span className="font-medium text-lg">Add My Business</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium text-lg">Admin</span>
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
