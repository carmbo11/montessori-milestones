// Impact.com API Types

export interface ImpactCatalog {
  Id: string;
  Name: string;
  CampaignId: string;
  CampaignName: string;
  DateCreated: string;
  ItemCount: number;
}

export interface ImpactCatalogItem {
  Id: string;
  CatalogId: string;
  CatalogItemId: string;
  Name: string;
  Description: string;
  Price: string;
  Currency: string;
  OriginalPrice?: string;
  DiscountPercent?: string;
  ImageUrl: string;
  ProductUrl: string;
  TrackingLink?: string;
  Manufacturer?: string;
  Category?: string;
  SubCategory?: string;
  Availability: string;
  AgeRange?: string;
  Color?: string;
  Size?: string;
  Gtin?: string;
  Mpn?: string;
  Labels?: string[];
  DateCreated: string;
  DateLastUpdated: string;
}

export interface ImpactCatalogsResponse {
  Catalogs: ImpactCatalog[];
  '@page': number;
  '@numpages': number;
  '@pagesize': number;
  '@total': number;
  '@uri': string;
}

export interface ImpactCatalogItemsResponse {
  Items: ImpactCatalogItem[];
  '@page': number;
  '@numpages': number;
  '@pagesize': number;
  '@total': number;
  '@uri': string;
}

// Mapped type for our app's product format
export interface MappedProduct {
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

// Helper to map Impact catalog item to our product format
export function mapImpactItemToProduct(item: ImpactCatalogItem): MappedProduct {
  return {
    id: item.Id,
    name: item.Name,
    price: item.Price ? `$${item.Price}` : '',
    description: item.Description || '',
    imageUrl: item.ImageUrl || '',
    affiliateLink: item.TrackingLink || item.ProductUrl || '',
    badge: item.DiscountPercent ? `${item.DiscountPercent}% Off` : undefined,
    ageRange: item.AgeRange,
    category: item.Category,
  };
}
