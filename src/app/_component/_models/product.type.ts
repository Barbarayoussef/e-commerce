export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
