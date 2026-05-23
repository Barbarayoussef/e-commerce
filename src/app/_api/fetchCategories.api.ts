import { Category } from "../_component/_models/category.type";
import axios from "axios";
export function fetchCategories(): Promise<Category[]> {
  return axios
    .get(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`)
    .then((res) => res.data.categories)
    .catch((err) => console.log(err));
}
