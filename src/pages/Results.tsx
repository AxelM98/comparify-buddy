import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Zap, Save, Grid, List, Coins } from "lucide-react";
import ProductCard from "@/components/ProductCard";
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
  const { user } = useAuth();
  const [data, setData] = useState<ComparisonData | null>(null);
  const [metricsList, setMetricsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const stored = sessionStorage.getItem("comparisonData");
    if (!stored) {
      toast.error("No comparison data found.");
      navigate("/upload");
      return;
    }

    try {
      const parsed = JSON.parse(stored) as ComparisonData;
      setData(parsed);

      const metrics = parsed.products.map((p) =>
        calculatePricingRecommendation(p.similarProducts, p.price)
      );
      setMetricsList(metrics);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading data:", err);
      toast.error("Error loading results.");
      navigate("/upload");
    }
  }, [navigate]);

  const handlePriceChange = (index: number, newPrice: string) => {
    if (!data) return;
    const updated = [...data.products];
    updated[index].price = parseFloat(newPrice);
    setData({ ...data, products: updated });

    const updatedMetrics = [...metricsList];
    updatedMetrics[index] = calculatePricingRecommendation(
      updated[index].similarProducts,
      updated[index].price
    );
    setMetricsList(updatedMetrics);
  };

  const handleSaveComparison = async () => {
    if (!data) return;

    const payload = {
      analysis: {
        products: data.products,
        timestamp: data.timestamp,
      },
    };

    if (user && user.email) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/analysis/save`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

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
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <Link
          to="/upload"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Upload
        </Link>
        <button
          onClick={handleSaveComparison}
          className="btn-primary flex items-center"
        >
          <Save size={16} className="mr-2" /> Save
        </button>
      </div>

      <h1 className="text-3xl font-medium mb-10">Price Comparison Results</h1>

      {data?.products.map((product, index) => {
        const metrics = metricsList[index];

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass-card p-6 mb-10"
          >
            <div className="mb-4">
              <h2 className="text-3xl font-small text-foreground mb-4 capitalize">
                {product.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-1">
                {product.description}
              </p>
              <p className="text-sm text-muted-foreground mb-4 italic">
                SKU: {product.sku}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border-2 border-primary shadow p-6 bg-secondary/30 h-48 flex flex-col justify-center items-center">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Zap size={20} className="mr-2 text-primary" /> Suggested
                  Price:
                </h3>
                <p className="text-4xl font-bold text-primary">
                  ${metrics.suggestion.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl border-2 border-muted shadow p-6 h-50 flex flex-col justify-center items-center">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Coins size={20} className="mr-2 text-primary" /> Your Price:
                </h3>
                <div className="flex items-center">
                  <p className="text-4xl font-bold">$</p>
                  <input
                    type="number"
                    step="0.01"
                    value={product.price}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    className="text-4xl font-bold text-center rounded-lg outline-none bg-transparent 
                  [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none 
                  [&::-moz-appearance]:textfield"
                    style={{ width: `${String(product.price).length + 0.2}ch` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Stat
                label="Average Price"
                value={`$${metrics.average.toFixed(2)}`}
              />
              <Stat
                label="Median Price"
                value={`$${metrics.median.toFixed(2)}`}
              />
              <Stat
                label="Lowest Price"
                value={`$${metrics.lowest.toFixed(2)}`}
              />
              <Stat
                label="Highest Price"
                value={`$${metrics.highest.toFixed(2)}`}
              />
            </div>

            <div className="space-y-5 text-base text-muted-foreground mb-8">
              <p>
                <strong>Rationale:</strong> The average selling price on eBay
                for similar products is
                <span className="text-foreground font-medium">
                  {" "}
                  ${metrics.average.toFixed(2)}
                </span>
                , while prices vary widely between
                <span className="text-foreground font-medium">
                  {" "}
                  ${metrics.lowest.toFixed(2)}
                </span>{" "}
                and
                <span className="text-foreground font-medium">
                  {" "}
                  ${metrics.highest.toFixed(2)}
                </span>
                .
              </p>
              <p>
                <strong>Alternative Strategy:</strong>{" "}
                {metrics.suggestion < metrics.average
                  ? "Emphasize your competitive pricing in listings to attract more buyers."
                  : "If pricing higher, consider bundling or offering fast/free shipping to justify the value."}
              </p>
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
                {product.similarProducts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <ProductCard
                      product={{
                        id: p.id,
                        name: p.title,
                        image: p.galleryURL,
                        price: p.currentPrice || 0,
                        marketPrice: metrics.average,
                        rating: p.rating,
                        sold: p.sold,
                        source: p.source,
                      }}
                      isComparison={true}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="border p-4 rounded-lg bg-background text-center shadow-sm">
    <div className="text-sm text-muted-foreground mb-1">{label}</div>
    <div className="text-xl font-semibold text-foreground">{value}</div>
  </div>
);

export default Results;
