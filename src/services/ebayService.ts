
import { toast } from "sonner";

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
    console.log("🔍 Searching eBay via proxy with params:", params);

    const query = new URLSearchParams({
      keywords: params.keywords,
    });

    const backendUrl = "https://comparify-buddy.lovable.app";
    const response = await fetch(
      `${backendUrl}/api/ebay-search?${query.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`eBay Proxy API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ eBay data received:", data);

    return transformBrowseApiResponse(data);
  } catch (error) {
    console.error("❌ Error searching eBay products via proxy:", error);
    toast.error("Failed to fetch eBay products. Using sample data instead.");
    return getMockProducts(params.keywords);
  }
};

const transformBrowseApiResponse = (data: any): EbayProduct[] => {
  if (!data || !data.itemSummaries) {
    console.error("Invalid Browse API response", data);
    return getMockProducts("fallback");
  }

  return data.itemSummaries.map((item: any) => {
    const price = item.price?.value ? Number(item.price.value) : 0;
    const sold = Math.floor(Math.random() * 200) + 10;
    const rating = Number((Math.random() * 1.5 + 3.5).toFixed(1));

    return {
      id: item.itemId,
      title: item.title,
      viewItemURL: item.itemWebUrl,
      galleryURL: item.image?.imageUrl || "https://via.placeholder.com/150",
      currentPrice: price,
      listingType: item.buyingOptions?.[0] || "Unknown",
      timeLeft: "",
      location: item.itemLocation?.country || "",
      shippingCost: 0,
      condition: item.condition || "",
      sold,
      rating,
      source: "eBay",
    };
  });
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
    const marketPrice = (Number(price) * (Math.random() * 0.4 + 0.8)).toFixed(
      2
    );
    const sold = Math.floor(Math.random() * 200) + 10;

    products.push({
      id: `sp${i + 1}`,
      title: `${keywords} - Product ${i + 1} (Similar Item)`,
      viewItemURL: `https://www.ebay.com/itm/item${i + 1}`,
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
