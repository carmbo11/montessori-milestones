// Impact.com API Service
// Fetches affiliate products from Impact.com (or mock data if not configured)

export interface ImpactProduct {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  badge?: string;
  ageRange?: string;
  category?: string;
}

export interface ImpactProductsResponse {
  products: ImpactProduct[];
  source: 'impact' | 'mock';
  total?: number;
  page?: number;
  message?: string;
  error?: string;
}

const API_BASE = '/api/impact-products';

/**
 * Fetch all products from Impact.com catalog
 */
export async function fetchProducts(options?: {
  search?: string;
  category?: string;
  ageRange?: string;
}): Promise<ImpactProductsResponse> {
  try {
    const params = new URLSearchParams();
    if (options?.search) params.append('search', options.search);
    if (options?.category) params.append('category', options.category);
    if (options?.ageRange) params.append('ageRange', options.ageRange);

    const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Search products by query string
 */
export async function searchProducts(query: string): Promise<ImpactProduct[]> {
  const response = await fetchProducts({ search: query });
  return response.products;
}

/**
 * Get products filtered by age range
 */
export async function getProductsByAge(ageRange: string): Promise<ImpactProduct[]> {
  const response = await fetchProducts({ ageRange });
  return response.products;
}

/**
 * Get products filtered by category
 */
export async function getProductsByCategory(category: string): Promise<ImpactProduct[]> {
  const response = await fetchProducts({ category });
  return response.products;
}

/**
 * Find best product match for a child's age (in months)
 * Used by the chatbot to recommend products
 */
export function findProductForAge(products: ImpactProduct[], ageInMonths: number): ImpactProduct | null {
  // Parse age ranges and find best match
  for (const product of products) {
    if (!product.ageRange) continue;

    const range = product.ageRange.toLowerCase();

    // Parse "X-Y months" or "X-Y weeks" format
    const monthMatch = range.match(/(\d+)-(\d+)\s*months?/);
    const weekMatch = range.match(/(\d+)-(\d+)\s*weeks?/);

    if (monthMatch) {
      const min = parseInt(monthMatch[1]);
      const max = parseInt(monthMatch[2]);
      if (ageInMonths >= min && ageInMonths <= max) {
        return product;
      }
    } else if (weekMatch) {
      const minWeeks = parseInt(weekMatch[1]);
      const maxWeeks = parseInt(weekMatch[2]);
      const ageInWeeks = ageInMonths * 4;
      if (ageInWeeks >= minWeeks && ageInWeeks <= maxWeeks) {
        return product;
      }
    }
  }

  // No exact match, find closest
  return products[0] || null;
}
