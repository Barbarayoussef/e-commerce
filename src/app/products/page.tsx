import React from "react";
import { fetchProducts } from "../_api/fetchProducts.api";
import { Product } from "../_component/_models/product.type";
import ProductCard from "../_component/productCard/page";
import { fetchCategories } from "../_api/fetchCategories.api";

export default async function Product() {
  const products = await fetchProducts();
  const categories = await fetchCategories();

  return (
    <>
      <h1 className="text-center text-2xl ">Shop Now</h1>
      <div className="flex gap-4 justify-center flex-wrap ">
        {products.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            categories={categories}
          ></ProductCard>
        ))}
      </div>
    </>
  );
}
