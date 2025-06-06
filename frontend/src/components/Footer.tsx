
import { Link } from "react-router-dom";
import { Building, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#333333] text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MarylandBiz</h3>
            <p className="text-gray-300 text-sm mb-4">
              Your one-stop directory for discovering and connecting with businesses across Maryland.
            </p>
            {/* Social media icons removed */}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/businesses" className="text-gray-300 hover:text-white">Browse Businesses</Link></li>
              <li><Link to="/add-business" className="text-gray-300 hover:text-white">Add Your Business</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/restaurants" className="text-gray-300 hover:text-white">Restaurants</Link></li>
              <li><Link to="/category/retail" className="text-gray-300 hover:text-white">Retail</Link></li>
              <li><Link to="/category/professional" className="text-gray-300 hover:text-white">Professional Services</Link></li>
              <li><Link to="/category/healthcare" className="text-gray-300 hover:text-white">Healthcare</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white">View All</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>5011 Arbutus Ave, Baltimore, MD, United States, 21215</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1-888-PCG-0630</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@pcg.org</span>
              </div>
            </div>
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
