import type { Category, CloudinaryImage } from './category.types';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string | Category;   // string (id) or populated Category
  image: CloudinaryImage;
  isVeg: boolean;
  isTrending: boolean;
  rating: number;
  available: boolean;
  createdAt: string;
}

export interface MenuFilters {
  categoryId?: string;
  search?: string;
  available?: boolean;
  isVeg?: boolean;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "rating";
}

export interface CreateMenuItemDto {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: File;
  isVeg: boolean;
  isTrending?: boolean;
}
