
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedPage from "@/components/AnimatedPage";

const NotFound = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <h1 className="text-9xl font-bold text-primary">404</h1>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-semibold mt-4 mb-6"
            >
              Page Not Found
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-8"
            >
              The page you are looking for doesn't exist or has been moved.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Go Home
              </Link>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default NotFound;
