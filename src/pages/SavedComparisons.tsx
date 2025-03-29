
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Trash2, 
  BarChart4, 
  Calendar, 
  Tag,
  Info,
  Download,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  image?: string;
  price: number;
  sku?: string;
  description?: string;
  similarProducts: any[];
}

interface Comparison {
  products: Product[];
  mainProduct?: Product;  // For backward compatibility
  timestamp: string;
  similarProducts?: any[]; // For backward compatibility
}

const SavedComparisons = () => {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    // Load saved comparisons from localStorage
    const saved = JSON.parse(localStorage.getItem("savedComparisons") || "[]");
    setComparisons(saved);
    setIsEmpty(saved.length === 0);
  }, []);

  const handleDelete = (index: number) => {
    const updatedComparisons = [...comparisons];
    updatedComparisons.splice(index, 1);
    
    localStorage.setItem("savedComparisons", JSON.stringify(updatedComparisons));
    setComparisons(updatedComparisons);
    setIsEmpty(updatedComparisons.length === 0);
    
    toast.success("Comparison removed from saved list");
  };

  const handleExport = (index: number) => {
    // In a real app, this would generate a CSV or PDF
    // For now, just show a toast
    const comparison = comparisons[index];
    const productName = getMainProductName(comparison);
    toast.success(`Export for "${productName}" coming soon`);
  };

  // Helper function to get the main product name, handling both data structures
  const getMainProductName = (comparison: Comparison): string => {
    if (comparison.mainProduct && comparison.mainProduct.name) {
      return comparison.mainProduct.name;
    }
    
    if (comparison.products && comparison.products.length > 0 && comparison.products[0].name) {
      return comparison.products[0].name;
    }
    
    return "Unknown Product";
  };

  // Helper function to get the main product price
  const getMainProductPrice = (comparison: Comparison): number => {
    if (comparison.mainProduct && typeof comparison.mainProduct.price === 'number') {
      return comparison.mainProduct.price;
    }
    
    if (comparison.products && comparison.products.length > 0 && typeof comparison.products[0].price === 'number') {
      return comparison.products[0].price;
    }
    
    return 0;
  };

  // Helper function to get similar products count
  const getSimilarProductsCount = (comparison: Comparison): number => {
    if (comparison.similarProducts && Array.isArray(comparison.similarProducts)) {
      return comparison.similarProducts.length;
    }
    
    if (comparison.products && comparison.products.length > 0 && 
        comparison.products[0].similarProducts && 
        Array.isArray(comparison.products[0].similarProducts)) {
      return comparison.products[0].similarProducts.length;
    }
    
    return 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <Link
              to="/"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors mr-6"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl font-semibold">Saved Comparisons</h1>
          </div>

          {isEmpty ? (
            <div className="glass-card p-12 text-center">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Info size={32} className="text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-3">No saved comparisons yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't saved any product comparisons yet. Compare a product and click 
                "Save" to add it to your saved list.
              </p>
              <Link to="/upload" className="btn-primary">
                Compare Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {comparisons.map((comparison, index) => (
                <motion.div
                  key={`comparison-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-4 lg:mb-0">
                      <h2 className="text-xl font-medium mb-2">
                        {getMainProductName(comparison)}
                      </h2>
                      <div className="flex flex-wrap items-center text-sm text-muted-foreground">
                        <div className="flex items-center mr-6 mb-2">
                          <Calendar size={14} className="mr-1.5" />
                          <span>{formatDate(comparison.timestamp)}</span>
                        </div>
                        <div className="flex items-center mr-6 mb-2">
                          <Tag size={14} className="mr-1.5" />
                          <span>${getMainProductPrice(comparison).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <BarChart4 size={14} className="mr-1.5" />
                          <span>{getSimilarProductsCount(comparison)} similar products</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button 
                        onClick={() => handleExport(index)}
                        className="btn-ghost text-sm px-3 py-2 flex items-center"
                      >
                        <Download size={16} className="mr-1.5" />
                        Export
                      </button>
                      <Link
                        to="/results"
                        onClick={() => {
                          // Store in sessionStorage to view in results page
                          sessionStorage.setItem(
                            "comparisonData", 
                            JSON.stringify(comparison)
                          );
                        }}
                        className="btn-ghost text-sm px-3 py-2 flex items-center"
                      >
                        <ExternalLink size={16} className="mr-1.5" />
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(index)}
                        className="btn-ghost text-sm px-3 py-2 flex items-center text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={16} className="mr-1.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SavedComparisons;
