
import { Building, Home, Search, PlusCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
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
      <div className="container">
        <div className="flex h-16 items-center justify-between flex-col md:flex-row gap-4 md:gap-0 py-3 md:py-0">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Building className="h-6 w-6 text-primary" strokeWidth={2.5} />
            </motion.div>
            <span className="text-2xl font-bold">
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
          
          <nav className="flex items-center">
            <ul className="flex items-center space-x-4 md:space-x-6">
              <motion.li variants={navItemVariants} whileHover="hover">
                <Link to="/" className="flex items-center gap-2 px-3 py-2 hover:bg-primary hover:text-white rounded-md transition-all">
                  <Home className="h-4 w-4" strokeWidth={2.5} />
                  <span className="font-medium">Home</span>
                </Link>
              </motion.li>
              <motion.li variants={navItemVariants} whileHover="hover">
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-primary hover:text-white rounded-md transition-all">
                  <Search className="h-4 w-4" strokeWidth={2.5} />
                  <span className="font-medium">Browse</span>
                </button>
              </motion.li>
              <motion.li variants={navItemVariants} whileHover="hover">
                <Link to="/add-my-business" className="flex items-center gap-2 px-3 py-2 hover:bg-primary hover:text-white rounded-md transition-all">
                  <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
                  <span className="font-medium">Add My Business</span>
                </Link>
              </motion.li>
              <motion.li variants={navItemVariants} whileHover="hover">
                <Link to="/admin" className="flex items-center gap-2 px-3 py-2 hover:bg-primary hover:text-white rounded-md transition-all">
                  <User className="h-4 w-4" strokeWidth={2.5} />
                  <span className="font-medium">Admin</span>
                </Link>
              </motion.li>
            </ul>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
