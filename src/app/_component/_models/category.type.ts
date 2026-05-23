export interface Root {
  page: number;
  message: string;
  categories: Category[];
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}
