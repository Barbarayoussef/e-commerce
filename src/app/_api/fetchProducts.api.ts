import axios from "axios";
import { Product } from "../_component/_models/product.type";
export function fetchProducts(): Promise<Product[]> {
  return axios
    .get(`${process.env.NEXT_PUBLIC_BASE_URL}/products`)
    .then((res) => res.data.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
}
