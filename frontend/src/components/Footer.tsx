import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Leaf,
} from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 font-bold text-2xl">
              <Leaf className="fill-current" />
              <span>Veggi</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Bringing the farm's finest directly to your doorstep. Fresh,
              organic, and sustainably grown.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-500">
              <li>
                <FooterLink to="/shop">Shop All</FooterLink>
              </li>
              <li>
                <FooterLink to="/offers">Deals & Offers</FooterLink>
              </li>
              <li>
                <FooterLink to="/orders">Track Order</FooterLink>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Support</h4>
            <ul className="space-y-2 text-gray-500">
              <li>
                <FooterLink to="/faq">FAQs</FooterLink>
              </li>
              <li>
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink to="/terms">Terms of Service</FooterLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-green-600" />
                <span>123 Green Valley, Organic Lane Colombo 10</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-green-600" />
                <span>+94 (71) 0702616</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-green-600" />
                <span>Sagunthagr@veggi.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Veggi. All rights reserved.
          </p>
          <div className="flex gap-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              className="h-3 opacity-50 grayscale hover:grayscale-0 transition-all"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

// Sub-components for cleaner code
const FooterLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="hover:text-green-600 hover:translate-x-1 transition-all duration-200 inline-block"
  >
    {children}
  </Link>
);

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <motion.a
    href="#"
    whileHover={{ y: -3 }}
    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors"
  >
    {icon}
  </motion.a>
);
