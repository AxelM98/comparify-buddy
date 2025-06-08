import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, BarChart, Upload, User, Save, LogOut } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

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

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });

    setUser(null);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <BarChart size={18} /> },
    { name: "Upload", href: "/upload", icon: <Upload size={18} /> },
    { name: "Saved", href: "/saved", icon: <Save size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (user) {
      console.log("Current user object:", user);
    }
  }, [user]);

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

            {user ? (
              <div className="flex items-center space-x-3 ml-4">
                {user.photos && (
                  <img
                    src={user.photos[0].value}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="mr-2">
                  {user.name?.givenName || user.displayName || "User"}
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-secondary dark:hover:bg-gray-800 text-foreground dark:text-gray-200 transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>

                <div className="ml-4">
                  <DarkModeToggle />
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-secondary dark:hover:bg-gray-800 text-foreground dark:text-gray-200"
                >
                  <User size={18} />
                  <span>Login</span>
                </Link>
                <div className="ml-4">
                  <DarkModeToggle />
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
