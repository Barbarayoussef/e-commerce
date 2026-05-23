import { Category } from "../_component/_models/category.type";
import axios from "axios";
export function fetchCategories(): Promise<Category[]> {
  return axios
    .get("https://nti-ecommerce.vercel.app/api/v1/categories")
    .then((res) => res.data.categories)
    .catch((err) => console.log(err));
}
