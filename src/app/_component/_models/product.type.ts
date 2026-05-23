export interface Root {
  page: number;
  message: string;
  Products: Product[];
}

export interface Product {
  _id: string;
  title: string;
  price: number;
  priceAfterDiscount: number;
  description: string;
  stock: number;
  sold: number;
  imageCover: string;
  images: string[];
  category: string;
  subCategory: string;
  brand: string;
  ratingAvg: any;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  reviews: any[];
  id: string;
}
