
import React from "react";
import { ArrowUpDown, ExternalLink, Share2 } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image?: string;
    price: number;
    marketPrice?: number;
    currency?: string;
    rating?: number;
    sold?: number;
    source?: string;
  };
  isComparison?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isComparison = false,
}) => {
  const {
    name,
    image,
    price,
    marketPrice,
    currency = "$",
    rating = 0,
    sold = 0,
    source = "eBay",
  } = product;

  const priceDifference = marketPrice ? marketPrice - price : 0;
  const percentageDiff = marketPrice ? (priceDifference / marketPrice) * 100 : 0;
  const isPriceHigher = priceDifference < 0;

  return (
    <div className="glass-card overflow-hidden flex flex-col animate-scale-in">
      <div className="relative overflow-hidden group">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-48 bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        
        {isComparison && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-white/90">Source:</span>
                <span className="text-xs text-white font-medium">{source}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200">
                  <ExternalLink size={14} className="text-white" />
                </button>
                <button className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200">
                  <Share2 size={14} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-foreground line-clamp-2 mb-2 h-12">
          {name}
        </h3>

        <div className="mt-auto">
          {isComparison && marketPrice && (
            <div
              className={`flex items-center text-xs mb-2 ${
                isPriceHigher ? "text-destructive" : "text-emerald-600"
              }`}
            >
              <ArrowUpDown size={14} className="mr-1.5" />
              <span>
                {isPriceHigher
                  ? `${Math.abs(percentageDiff).toFixed(1)}% above market`
                  : `${percentageDiff.toFixed(1)}% below market`}
              </span>
            </div>
          )}

          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-semibold">
                  {currency}
                  {price.toFixed(2)}
                </span>
                {isComparison && marketPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {currency}
                    {marketPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              {isComparison && (
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="mr-2">★ {rating.toFixed(1)}</span>
                  <span>{sold} sold</span>
                </div>
              )}
            </div>
            
            {!isComparison && (
              <button className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 rounded-lg transition-colors duration-200">
                Compare
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
