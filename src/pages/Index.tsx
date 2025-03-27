
import React from "react";
import { motion } from "framer-motion";
import { BarChart, ArrowRight, Upload, Save, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Smart E-Commerce Price Optimization
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Optimize Your Product Pricing
              <br className="hidden md:block" /> with
              <span className="text-gradient"> Market Data</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Compare your product prices with market trends on eBay to maximize 
              profitability and stay competitive in your market.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/upload" className="btn-primary flex items-center">
                <Upload size={18} className="mr-2" />
                Upload Products
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link to="/auth" className="btn-secondary flex items-center">
                <Zap size={18} className="mr-2" />
                Try Demo
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative mx-auto rounded-2xl overflow-hidden shadow-xl max-w-5xl glass-card"
          >
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2426&q=80" 
              alt="Price Comparison Dashboard" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful Features for Price Optimization
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to make data-driven pricing decisions and stay competitive
              in the ever-changing e-commerce landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.2 + index * 0.1, 
                  ease: "easeOut" 
                }}
                className="glass-card p-6 flex flex-col"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-muted-foreground flex-1">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-10 md:p-16 rounded-3xl overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Start Optimizing Your Product Prices Today
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Upload your products, get instant market analysis, and make informed 
                  pricing decisions to maximize your profits.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/upload" className="btn-primary">
                    Get Started
                  </Link>
                  <Link to="/auth" className="btn-ghost">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="w-full max-w-sm">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full animate-pulse-light"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/5 rounded-full animate-pulse-light"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Product price analysis" 
                    className="rounded-xl shadow-lg relative z-10"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Features data
const features = [
  {
    title: "Competitive Analysis",
    description: "Compare your prices with similar products on eBay to understand market positioning.",
    icon: <BarChart size={24} />,
  },
  {
    title: "Bulk Upload",
    description: "Upload your entire product catalog via CSV/Excel for quick and easy analysis.",
    icon: <Upload size={24} />,
  },
  {
    title: "Save & Export",
    description: "Save your price analyses and export them as PDF or CSV files for further review.",
    icon: <Save size={24} />,
  },
  {
    title: "Price Suggestions",
    description: "Get intelligent price recommendations based on market data and trends.",
    icon: <Zap size={24} />,
  },
  {
    title: "Market Trends",
    description: "View historical price trends to understand market fluctuations and predict changes.",
    icon: <ArrowRight size={24} />,
  },
  {
    title: "Best Sellers",
    description: "Identify top-selling products in your category to find new opportunities.",
    icon: <BarChart size={24} />,
  },
];

export default Index;
