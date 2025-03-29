
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, BarChart, Upload, User, Save } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", href: "/", icon: <BarChart size={18} /> },
    { name: "Upload", href: "/upload", icon: <Upload size={18} /> },
    { name: "Saved", href: "/saved", icon: <Save size={18} /> },
    { name: "Login", href: "/auth", icon: <User size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-card py-3 shadow-md dark:bg-gray-900/90 dark:border-gray-800"
          : "bg-transparent py-5 dark:bg-transparent"
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-semibold"
          >
            <span className="text-primary dark:text-blue-400">Comparify</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary text-primary-foreground dark:bg-blue-600"
                    : "hover:bg-secondary dark:hover:bg-gray-800 text-foreground dark:text-gray-200"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="ml-4">
              <DarkModeToggle />
            </div>
          </nav>

          {/* Mobile navigation toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <DarkModeToggle />
            <button
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground dark:text-gray-200" />
              ) : (
                <Menu className="h-6 w-6 text-foreground dark:text-gray-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden glass-card mt-2 mx-4 rounded-xl overflow-hidden dark:bg-gray-900/90 dark:border-gray-800"
        >
          <nav className="flex flex-col p-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary text-primary-foreground dark:bg-blue-600"
                    : "hover:bg-secondary dark:hover:bg-gray-800 text-foreground dark:text-gray-200"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
