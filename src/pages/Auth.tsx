import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Mail, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      if (isLogin) {
        toast({
          title: "Login successful",
          description: "Welcome back to Comparify!",
        });
      } else {
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        });
      }

      // Redirect to home page
      window.location.href = "/";
    }, 1500);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      toast({
        title: "Demo mode activated",
        description: "You are now using Comparify in demo mode.",
      });

      // Redirect to home page
      window.location.href = "/";
    }, 1000);
  };

  console.log("VITE_BACKEND_URL =", import.meta.env.VITE_BACKEND_URL);

  return (
    <div className="min-h-screen flex items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="max-w-5xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-2xl overflow-hidden dark:shadow-gray-800/30">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-primary/10 p-12 hidden md:flex md:flex-col dark:bg-primary/5"
          >
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-semibold"
            >
              <span className="text-primary">Comparify</span>
            </Link>
            <div className="mt-auto">
              <h2 className="text-3xl font-bold mb-4 dark:text-gray-100">
                Optimize your e-commerce pricing strategy
              </h2>
              <p className="text-muted-foreground mb-8 dark:text-gray-300">
                Compare your products with market data to make better pricing
                decisions.
              </p>
              <img
                src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Price analysis dashboard"
                className="rounded-xl shadow-lg dark:shadow-gray-900/50"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 sm:p-12 dark:bg-gray-900"
          >
            <div className="md:hidden mb-10">
              <Link
                to="/"
                className="flex items-center space-x-2 text-xl font-semibold"
              >
                <span className="text-primary">Comparify</span>
              </Link>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-2 dark:text-white">
                {isLogin ? "Sign in to your account" : "Create your account"}
              </h2>
              <p className="text-muted-foreground dark:text-gray-400">
                {isLogin
                  ? "Welcome back! Enter your details to access your account."
                  : "Get started with your free account to optimize your pricing."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2 dark:text-gray-200"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="glass-input w-full px-4 py-3 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 dark:text-gray-200"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2 dark:text-gray-200"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="glass-input w-full px-4 py-3 pr-10 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/50 dark:border-gray-700 dark:bg-gray-800"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline dark:text-blue-400"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-border flex-grow dark:border-gray-700"></div>
                <div className="px-3 text-xs text-muted-foreground dark:text-gray-500">
                  or continue with
                </div>
                <div className="border-t border-border flex-grow dark:border-gray-700"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="btn-ghost flex items-center justify-center dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Github size={18} className="mr-2" />
                  GitHub
                </button>
                <a
                  href="https://comparify-buddy.lovable.app/auth/google"
                  className="btn-ghost flex items-center justify-center ..."
                >
                  <Mail size={18} className="mr-2" />
                  Google
                </a>
              </div>
            </form>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-primary hover:underline text-sm font-medium dark:text-blue-400"
              >
                Continue as guest in demo mode
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm dark:text-gray-300">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-primary hover:underline font-medium dark:text-blue-400"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
