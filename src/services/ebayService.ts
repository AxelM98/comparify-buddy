
import { toast } from "sonner";

// eBay API credentials
const APP_ID = "AxelMagn-Test-SBX-8b7ec7265-4b89c0d2";

interface EbaySearchParams {
  keywords: string;
  categoryId?: string;
  sortOrder?: string;
  itemsPerPage?: number;
  pageNumber?: number;
}

interface EbayProduct {
  id: string;
  title: string;
  viewItemURL?: string;
  galleryURL?: string;
  currentPrice?: number;
  listingType?: string;
  timeLeft?: string;
  location?: string;
  shippingCost?: number;
  condition?: string;
  sold?: number;
  rating?: number;
  source: string;
}

/**
 * Search for products on eBay
 */
export const searchEbayProducts = async (
  params: EbaySearchParams
): Promise<EbayProduct[]> => {
  try {
    console.log("Searching eBay with params:", params);
    
    // Build the eBay Shopping API URL
    const baseUrl = "https://open.api.sandbox.ebay.com/shopping";
    
    const queryParams = new URLSearchParams({
      callname: "FindProducts",
      responseencoding: "JSON",
      appid: APP_ID,
      siteid: "0", // US site
      version: "1.0.0",
      QueryKeywords: params.keywords,
      MaxEntries: params.itemsPerPage?.toString() || "10",
      PageNumber: params.pageNumber?.toString() || "1",
      // Add additional parameters as needed
    });

    if (params.categoryId) {
      queryParams.append("CategoryID", params.categoryId);
    }

    const url = `${baseUrl}?${queryParams.toString()}`;
    
    // Due to CORS restrictions with the eBay API in browser environments,
    // we'll attempt the fetch, but expect it might fail
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Include any required auth headers here
        },
        // Note: 'no-cors' mode will result in an opaque response that can't be read
        // So we're not using it as it would prevent us from accessing the response data
      });

      if (!response.ok) {
        console.error("eBay API Error:", response.status, response.statusText);
        throw new Error(`eBay API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("eBay API response:", data);
      
      return transformEbayResponse(data);
    } catch (fetchError) {
      console.error("CORS or fetch error with eBay API:", fetchError);
      
      // In a production environment, you would want to:
      // 1. Use a proxy server to make these requests
      // 2. Use eBay's official SDK which handles authentication properly
      // For now, we'll use mock data
      toast.warning("Unable to connect to eBay API directly due to CORS restrictions. Using sample data instead.");
      
      return getMockProducts(params.keywords);
    }
  } catch (error) {
    console.error("Error searching eBay products:", error);
    toast.error("Failed to fetch eBay products. Using sample data instead.");
    
    // Return mock data if there's an error
    return getMockProducts(params.keywords);
  }
};

/**
 * Transform eBay API response to our internal format
 */
const transformEbayResponse = (data: any): EbayProduct[] => {
  // For now, return mock data until we verify the exact response structure
  // This should be updated with the actual structure after testing
  return getMockProducts("sample");
};

/**
 * Get mock products for development and fallback
 */
const getMockProducts = (keywords: string): EbayProduct[] => {
  // Generate a random number of results between 3 and 10
  const count = Math.floor(Math.random() * 8) + 3;
  const products: EbayProduct[] = [];
  
  // Product image URLs for development
  const imageUrls = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
    "https://images.unsplash.com/photo-1605348532760-6753d2c43329",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  ];
  
  for (let i = 0; i < count; i++) {
    const price = (Math.random() * 100 + 50).toFixed(2);
    const marketPrice = (Number(price) * (Math.random() * 0.4 + 0.8)).toFixed(2);
    const sold = Math.floor(Math.random() * 200) + 10;
    
    products.push({
      id: `sp${i + 1}`,
      title: `${keywords} - Product ${i + 1} (Similar Item)`,
      viewItemURL: `https://www.sandbox.ebay.com/itm/item${i + 1}`,
      galleryURL: imageUrls[i % imageUrls.length],
      currentPrice: Number(price),
      listingType: Math.random() > 0.5 ? "FixedPrice" : "Auction",
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
      sold,
      source: "eBay",
    });
  }
  
  return products;
};

/**
 * Calculate pricing recommendation based on similar products
 */
export const calculatePricingRecommendation = (
  products: EbayProduct[],
  currentPrice?: number
) => {
  if (!products.length) {
    return {
      yourPrice: currentPrice || 0,
      median: 0,
      average: 0,
      lowest: 0,
      highest: 0,
      suggestion: 0,
    };
  }

  // Extract all prices
  const prices = products.map((p) => p.currentPrice || 0).filter((p) => p > 0);
  
  if (!prices.length) {
    return {
      yourPrice: currentPrice || 0,
      median: 0,
      average: 0,
      lowest: 0,
      highest: 0,
      suggestion: 0,
    };
  }

  // Sort prices for median calculation
  prices.sort((a, b) => a - b);
  
  // Calculate statistics
  const lowest = prices[0];
  const highest = prices[prices.length - 1];
  const sum = prices.reduce((a, b) => a + b, 0);
  const average = sum / prices.length;
  
  // Calculate median
  let median;
  const mid = Math.floor(prices.length / 2);
  if (prices.length % 2 === 0) {
    median = (prices[mid - 1] + prices[mid]) / 2;
  } else {
    median = prices[mid];
  }
  
  // Calculate suggested price (slightly below average but above lowest)
  const suggestion = Math.max(
    lowest * 1.05,
    Math.min(average * 0.95, median * 0.97)
  );

  return {
    yourPrice: currentPrice || 0,
    median,
    average,
    lowest,
    highest,
    suggestion: Number(suggestion.toFixed(2)),
  };
};

export type { EbayProduct, EbaySearchParams };
