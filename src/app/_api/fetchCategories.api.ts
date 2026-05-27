import { Category } from "../_component/_models/category.type";
import axios from "axios";
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/categories/all`,
    );
    console.log("hii", res.data.categories);
    return res.data.categories;
  } catch (err) {
    console.log(err);
    return [];
  }
}
