export type GearCategory = string;

export type Gear = {
  id: string | number;
  name: string;
  description?: string | null;
  category: GearCategory;
  brand?: string | null;
  pricePerDay: number;
  stock: number;
  available: boolean;
  images?: string[];
  provider?: ProviderSummary;
};

export type ProviderSummary = {
  id?: string | number;
  name: string;
  location?: string | null;
  rating?: number | null;
};

export type GearFilters = {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  availableFrom?: string;
  availableTo?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

export type GearPayload = {
  name: string;
  description?: string;
  category: string;
  brand?: string;
  pricePerDay: number;
  stock: number;
  available: boolean;
  imageUrl?: string;
};