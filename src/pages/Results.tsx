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
  Grid,
  List,
  Zap,
  Loader2,
} from "lucide-react";
import {
  EbayProduct,
  calculatePricingRecommendation,
} from "@/services/ebayService";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();

  useEffect(() => {
    const storedData = sessionStorage.getItem("comparisonData");
    if (!storedData) {
      toast.error("No comparison data found. Please upload products first.");
      setTimeout(() => navigate("/upload"), 1500);
      return;
    }

    try {
      const parsedData = JSON.parse(storedData) as ComparisonData;
      setData(parsedData);

      const metrics = parsedData.products.map((product) =>
        calculatePricingRecommendation(product.similarProducts, product.price)
      );
      setComparisonMetrics(metrics);
      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing comparison data:", error);
      toast.error("Error loading comparison data.");
      setTimeout(() => navigate("/upload"), 1500);
    }
  }, [navigate]);

  const handleSaveComparison = async () => {
    if (!data) return;

    const payload = {
      analysis: {
        products: data.products,
        timestamp: data.timestamp,
      },
    };
    console.log("User in handleSaveComparison:", user);
    if (user && user.email) {
      try {
        const res = await fetch("http://localhost:5001/api/analysis/save", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to save");

        toast.success("✅ Saved to your account");
      } catch (err) {
        console.error("Save to DB failed:", err);
        toast.error("❌ Could not save to your account");
      }
    } else {
      const saved = JSON.parse(
        localStorage.getItem("savedComparisons") || "[]"
      );
      saved.push(payload.analysis);
      localStorage.setItem("savedComparisons", JSON.stringify(saved));
      toast.success("💾 Saved locally");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin mx-auto mb-4 text-primary"
          />
          <h2 className="text-xl font-medium">Loading comparison data...</h2>
        </div>
      </div>
    );
  }

  if (!data || !data.products || data.products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">
            No comparison data available
          </h2>
          <Link to="/upload" className="btn-primary">
            Return to Upload
          </Link>
        </div>
      </div>
    );
  }

  const StatBox = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-lg border p-4 bg-background shadow-sm text-center">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );

  const activeProduct = data.products[activeProductIndex];
  const { similarProducts } = activeProduct;
  const metrics = comparisonMetrics[activeProductIndex];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <Link
                to="/upload"
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeft size={18} className="mr-2" />
                <span>Back to Upload</span>
              </Link>
              <h1 className="text-2xl font-semibold">Market Price Analysis</h1>
            </div>
            <button
              onClick={handleSaveComparison}
              className="btn-primary self-start"
            >
              Save
            </button>
          </div>

          {metrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card p-8 mb-16"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Pricing Recommendation
                </h2>
                <Zap size={24} className="text-primary" />
              </div>

              {/* Suggested Price First */}
              <div className="rounded-xl border-2 border-primary shadow-md p-6 mb-10 bg-secondary/30">
                <h3 className="text-lg font-medium mb-2 text-foreground">
                  Suggested Price
                </h3>
                <p className="text-4xl font-bold text-primary">
                  ${comparisonMetrics[activeProductIndex].suggestion.toFixed(2)}
                </p>
                <p className="text-muted-foreground mt-3 text-base">
                  This suggested price is based on eBay market data and is
                  intended to maximize both competitiveness and profitability.
                </p>
              </div>

              {/* Market Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatBox
                  label="Average Price"
                  value={`$${comparisonMetrics[
                    activeProductIndex
                  ].average.toFixed(2)}`}
                />
                <StatBox
                  label="Median Price"
                  value={`$${comparisonMetrics[
                    activeProductIndex
                  ].median.toFixed(2)}`}
                />
                <StatBox
                  label="Lowest Price"
                  value={`$${comparisonMetrics[
                    activeProductIndex
                  ].lowest.toFixed(2)}`}
                />
                <StatBox
                  label="Highest Price"
                  value={`$${comparisonMetrics[
                    activeProductIndex
                  ].highest.toFixed(2)}`}
                />
              </div>

              {/* Reasoning */}
              <div className="space-y-5 text-base text-muted-foreground">
                <p>
                  <strong>Rationale:</strong> The average selling price on eBay
                  for similar products is
                  <span className="text-foreground font-medium">
                    {" "}
                    ${comparisonMetrics[activeProductIndex].average.toFixed(2)}
                  </span>
                  , while prices vary widely between{" "}
                  <span className="text-foreground font-medium">
                    ${comparisonMetrics[activeProductIndex].lowest.toFixed(2)}
                  </span>
                  and{" "}
                  <span className="text-foreground font-medium">
                    ${comparisonMetrics[activeProductIndex].highest.toFixed(2)}
                  </span>
                  .
                </p>

                <p>
                  <strong>Alternative Strategy:</strong>{" "}
                  {comparisonMetrics[activeProductIndex].suggestion <
                  comparisonMetrics[activeProductIndex].average
                    ? "Emphasize your competitive pricing in listings to attract more buyers."
                    : "If pricing higher, consider bundling or offering fast/free shipping to justify the value."}
                </p>
              </div>
            </motion.div>
          )}

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
                      marketPrice: metrics.average,
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
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
