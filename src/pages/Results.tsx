
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import ComparisonTable from "@/components/ComparisonTable";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Save, 
  Filter, 
  SlidersHorizontal, 
  Grid,
  List, 
  Zap 
} from "lucide-react";

// Sample data
const mainProduct = {
  id: "p1",
  name: "Nike Air Zoom Pegasus 38 Running Shoes",
  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  price: 119.99,
};

const similarProducts = [
  {
    id: "sp1",
    name: "Nike Air Zoom Pegasus 38 Running Shoes - Men's Size 10",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    price: 109.99,
    marketPrice: 119.99,
    rating: 4.7,
    sold: 128,
    source: "eBay",
  },
  {
    id: "sp2",
    name: "Nike Pegasus 38 Men's Running Shoe - Black/White",
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    price: 99.95,
    marketPrice: 119.99,
    rating: 4.5,
    sold: 87,
    source: "eBay",
  },
  {
    id: "sp3",
    name: "Nike Air Zoom Pegasus 38 - Athletic Shoes",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    price: 124.99,
    marketPrice: 119.99,
    rating: 4.3,
    sold: 42,
    source: "eBay",
  },
  {
    id: "sp4",
    name: "Nike Pegasus 38 Running Shoes for Men",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    price: 114.50,
    marketPrice: 119.99,
    rating: 4.8,
    sold: 156,
    source: "eBay",
  },
];

const comparisonData = {
  yourPrice: 119.99,
  median: 114.50,
  average: 112.36,
  lowest: 99.95,
  highest: 124.99,
  suggestion: 112.99,
};

const Results = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Link
                to="/upload"
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors mr-6"
              >
                <ArrowLeft size={18} className="mr-2" />
                <span>Back to Upload</span>
              </Link>
              <h1 className="text-2xl font-semibold">Product Comparison</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn-ghost text-sm flex items-center px-3 py-2">
                <Filter size={16} className="mr-1.5" />
                <span>Filter</span>
              </button>
              <button className="btn-ghost text-sm flex items-center px-3 py-2">
                <SlidersHorizontal size={16} className="mr-1.5" />
                <span>Sort</span>
              </button>
              <button className="btn-ghost text-sm flex items-center px-3 py-2">
                <Download size={16} className="mr-1.5" />
                <span>Export</span>
              </button>
              <button className="btn-ghost text-sm flex items-center px-3 py-2">
                <Share2 size={16} className="mr-1.5" />
                <span>Share</span>
              </button>
              <button className="btn-primary text-sm flex items-center px-3 py-2">
                <Save size={16} className="mr-1.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              <div className="glass-card p-6 animate-fade-in">
                <h2 className="text-lg font-medium mb-4">Your Product</h2>
                <ProductCard product={mainProduct} />
              </div>
            </div>
            <div className="md:col-span-2">
              <ComparisonTable
                productName={mainProduct.name}
                data={comparisonData}
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Similar Products</h2>
              <div className="flex items-center space-x-2">
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {similarProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} isComparison={true} />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Pricing Recommendation</h2>
              <Zap size={18} className="text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              Based on the market analysis, we recommend the following pricing strategy:
            </p>
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <p className="flex items-start mb-3">
                <span className="font-medium mr-2">•</span>
                <span>
                  <span className="font-medium">Suggested price:</span> ${comparisonData.suggestion.toFixed(2)} - This price is below the market average while maintaining profitability.
                </span>
              </p>
              <p className="flex items-start mb-3">
                <span className="font-medium mr-2">•</span>
                <span>
                  <span className="font-medium">Rationale:</span> The average selling price on eBay is ${comparisonData.average.toFixed(2)}, 
                  making your current price of ${comparisonData.yourPrice.toFixed(2)} above market. Reducing to 
                  the suggested price may increase sales volume.
                </span>
              </p>
              <p className="flex items-start">
                <span className="font-medium mr-2">•</span>
                <span>
                  <span className="font-medium">Alternative strategy:</span> If maintaining your current price point, 
                  consider offering free shipping or bundle deals to increase value perception.
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
