
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import ComparisonTable from "@/components/ComparisonTable";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Save, 
  Filter, 
  SlidersHorizontal, 
  Grid,
  List, 
  Zap,
  Loader2
} from "lucide-react";
import { EbayProduct, calculatePricingRecommendation } from "@/services/ebayService";

interface MainProduct {
  id: string;
  name: string;
  image?: string;
  price: number;
  sku?: string;
  description?: string;
  similarProducts: EbayProduct[];
}

interface ComparisonData {
  products: MainProduct[];
  timestamp: string;
}

const Results = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ComparisonData | null>(null);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [comparisonMetrics, setComparisonMetrics] = useState<any[]>([]);

  useEffect(() => {
    // Get data from sessionStorage
    const storedData = sessionStorage.getItem("comparisonData");
    
    if (!storedData) {
      toast.error("No comparison data found. Please upload products first.");
      // Redirect back to upload page after a short delay
      setTimeout(() => navigate("/upload"), 1500);
      return;
    }
    
    try {
      const parsedData = JSON.parse(storedData) as ComparisonData;
      setData(parsedData);
      
      // Calculate pricing recommendation for each product
      const metrics = parsedData.products.map(product => 
        calculatePricingRecommendation(
          product.similarProducts,
          product.price
        )
      );
      setComparisonMetrics(metrics);
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing comparison data:", error);
      toast.error("Error loading comparison data.");
      // Redirect back to upload page after a short delay
      setTimeout(() => navigate("/upload"), 1500);
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-medium">Loading comparison data...</h2>
        </div>
      </div>
    );
  }

  if (!data || !data.products || data.products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">No comparison data available</h2>
          <Link to="/upload" className="btn-primary">Return to Upload</Link>
        </div>
      </div>
    );
  }

  const activeProduct = data.products[activeProductIndex];
  const { similarProducts } = activeProduct;

  const handleSaveComparison = () => {
    // In a real app, this would save to a database
    // For now, just store in localStorage
    const savedComparisons = JSON.parse(localStorage.getItem("savedComparisons") || "[]");
    
    // Check if already saved
    const alreadySaved = savedComparisons.some(
      (comp: any) => comp.products.some((p: any) => p.id === data.products[0].id) &&
                    comp.timestamp === data.timestamp
    );
    
    if (alreadySaved) {
      toast.info("This comparison is already saved");
      return;
    }
    
    // Add to saved comparisons
    savedComparisons.push(data);
    localStorage.setItem("savedComparisons", JSON.stringify(savedComparisons));
    
    toast.success("Comparison saved successfully");
  };
  
  const handleShare = () => {
    // In a real app, this would generate a shareable link
    // For now, just copy the current URL
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };
  
  const handleExport = () => {
    // In a real app, this would generate a CSV or PDF
    // For now, just show a toast
    toast.success("Export feature coming soon");
  };

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
              <button 
                className="btn-ghost text-sm flex items-center px-3 py-2"
                onClick={handleExport}
              >
                <Download size={16} className="mr-1.5" />
                <span>Export</span>
              </button>
              <button 
                className="btn-ghost text-sm flex items-center px-3 py-2"
                onClick={handleShare}
              >
                <Share2 size={16} className="mr-1.5" />
                <span>Share</span>
              </button>
              <button 
                className="btn-primary text-sm flex items-center px-3 py-2"
                onClick={handleSaveComparison}
              >
                <Save size={16} className="mr-1.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Product selector for multiple products */}
          {data.products.length > 1 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-3">Your Products</h2>
              <div className="flex overflow-x-auto gap-4 pb-2">
                {data.products.map((product, index) => (
                  <div 
                    key={product.id}
                    onClick={() => setActiveProductIndex(index)}
                    className={`cursor-pointer rounded-lg p-3 min-w-[180px] transition-all ${
                      index === activeProductIndex 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'bg-secondary/30 border border-border hover:bg-secondary/50'
                    }`}
                  >
                    <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">${product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              <div className="glass-card p-6 animate-fade-in">
                <h2 className="text-lg font-medium mb-4">Your Product</h2>
                <ProductCard product={activeProduct} />
              </div>
            </div>
            <div className="md:col-span-2">
              {comparisonMetrics && activeProductIndex < comparisonMetrics.length && (
                <ComparisonTable
                  productName={activeProduct.name}
                  data={comparisonMetrics[activeProductIndex]}
                />
              )}
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
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.title,
                      image: product.galleryURL,
                      price: product.currentPrice || 0,
                      marketPrice: activeProduct.price,
                      rating: product.rating,
                      sold: product.sold,
                      source: product.source,
                    }} 
                    isComparison={true} 
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {comparisonMetrics && activeProductIndex < comparisonMetrics.length && (
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
                    <span className="font-medium">Suggested price:</span> ${comparisonMetrics[activeProductIndex].suggestion.toFixed(2)} - This price is below the market average while maintaining profitability.
                  </span>
                </p>
                <p className="flex items-start mb-3">
                  <span className="font-medium mr-2">•</span>
                  <span>
                    <span className="font-medium">Rationale:</span> The average selling price on eBay is ${comparisonMetrics[activeProductIndex].average.toFixed(2)}, 
                    making your current price of ${comparisonMetrics[activeProductIndex].yourPrice.toFixed(2)} {comparisonMetrics[activeProductIndex].yourPrice > comparisonMetrics[activeProductIndex].average ? 'above' : 'below'} market. 
                    {comparisonMetrics[activeProductIndex].yourPrice > comparisonMetrics[activeProductIndex].average ? 'Reducing to the suggested price may increase sales volume.' : 'Your price is competitive in the current market.'}
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>
                    <span className="font-medium">Alternative strategy:</span> {
                      comparisonMetrics[activeProductIndex].yourPrice > comparisonMetrics[activeProductIndex].average 
                        ? 'If maintaining your current price point, consider offering free shipping or bundle deals to increase value perception.'
                        : 'Consider highlighting your competitive pricing in your listing to attract more buyers.'
                    }
                  </span>
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
