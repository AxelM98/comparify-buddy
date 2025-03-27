
import React from "react";
import { ArrowDown, ArrowUp, Minus, Info, BarChart2 } from "lucide-react";

interface ComparisonTableProps {
  productName: string;
  data: {
    yourPrice: number;
    median: number;
    average: number;
    lowest: number;
    highest: number;
    suggestion: number;
  };
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  productName,
  data,
}) => {
  const { yourPrice, median, average, lowest, highest, suggestion } = data;

  const getPriceStatus = (price: number) => {
    const diff = yourPrice - price;
    const percentDiff = (diff / price) * 100;

    if (Math.abs(percentDiff) < 5) return "neutral"; // Within 5% range
    return diff > 0 ? "high" : "low";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "high":
        return <ArrowUp size={16} className="text-destructive" />;
      case "low":
        return <ArrowDown size={16} className="text-emerald-600" />;
      default:
        return <Minus size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium">{productName} Price Analysis</h3>
        <button className="flex items-center space-x-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
          <BarChart2 size={16} />
          <span>View Details</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-muted-foreground text-sm">Your Price</span>
          </div>
          <div className="text-3xl font-medium">${yourPrice.toFixed(2)}</div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-muted-foreground text-sm">Market Median</span>
            <div className="flex items-center space-x-1">
              {getStatusIcon(getPriceStatus(median))}
            </div>
          </div>
          <div className="text-3xl font-medium">${median.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {yourPrice > median
              ? `${((yourPrice - median) / median * 100).toFixed(1)}% above median`
              : yourPrice < median
              ? `${((median - yourPrice) / median * 100).toFixed(1)}% below median`
              : "Equal to median"}
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-muted-foreground text-sm">Market Average</span>
            <div className="flex items-center space-x-1">
              {getStatusIcon(getPriceStatus(average))}
            </div>
          </div>
          <div className="text-3xl font-medium">${average.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {yourPrice > average
              ? `${((yourPrice - average) / average * 100).toFixed(1)}% above average`
              : yourPrice < average
              ? `${((average - yourPrice) / average * 100).toFixed(1)}% below average`
              : "Equal to average"}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
          <span className="text-muted-foreground">Lowest Price</span>
          <span className="font-medium">${lowest.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
          <span className="text-muted-foreground">Highest Price</span>
          <span className="font-medium">${highest.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl">
          <div className="flex items-center">
            <span className="text-primary">Suggested Price</span>
            <button className="ml-1.5 text-primary/70 hover:text-primary">
              <Info size={14} />
            </button>
          </div>
          <span className="font-medium text-primary">${suggestion.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
