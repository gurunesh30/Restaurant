export interface CloudinaryImage {
  url: string;
  public_id: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: CloudinaryImage;
  sortOrder: number;
  itemCount?: number;   // virtual, from aggregation
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  image?: File;
  sortOrder?: number;
}
