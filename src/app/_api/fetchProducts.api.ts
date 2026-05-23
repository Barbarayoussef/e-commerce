import axios from "axios";
import { Product } from "../_component/_models/product.type";
export function fetchProducts(): Promise<Product[]> {
  return axios
    .get("https://nti-ecommerce.vercel.app/api/v1/products")
    .then((res) => res.data.Products)
    .catch((err) => {
      console.log(err);
    });
}
