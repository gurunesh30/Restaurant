export const CATEGORIES = [
  "Biryani",
  "Starters",
  "Curries",
  "Breads",
  "Rice & Noodles",
  "Soups",
  "Desserts",
  "Beverages",
  "Thali",
  "Street Food",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface CloudinaryImage {
  url: string;
  public_id: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: CloudinaryImage;
  isVeg: boolean;
  isTrending: boolean;
  rating: number;
  available: boolean;
  createdAt: string;
}

export interface MenuFilters {
  category?: Category;
  search?: string;
  available?: boolean;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "rating";
}