
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="bg-[#333333] text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 items-start">
          <div>
            <h3 className="text-lg font-semibold mb-4">MarylandBiz</h3>
            <p className="text-gray-300 text-sm">
              Your one-stop directory for discovering and connecting with businesses across Maryland.
            </p>
          </div>

          <div className="flex md:justify-center">
            <Link to="/about" className="text-white hover:text-primary font-bold text-lg transition-colors">
              About Us
            </Link>
          </div>

          <div className="flex md:justify-center">
            <Link to="/privacy-policy" className="text-white hover:text-primary font-bold text-lg transition-colors">
              Privacy Policy
            </Link>
          </div>

          <div className="flex md:justify-center">
            <Link to="/contact" className="text-white hover:text-primary font-bold text-lg transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 MarylandBiz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
