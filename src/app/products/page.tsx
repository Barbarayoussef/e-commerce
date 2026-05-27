import React from "react";
import { fetchProducts } from "../_api/fetchProducts.api";
import { Product } from "../_component/_models/product.type";
import ProductCard from "../_component/productCard/page";
import { fetchCategories } from "../_api/fetchCategories.api";

export default async function Product() {
  const products = await fetchProducts();

  if (!products || products.length === 0) {
    return <h2 className="text-center">No products found.</h2>;
  }

  return (
    <>
      <h1 className="text-center text-2xl">Shop Now</h1>
      <div className="flex gap-4 justify-center flex-wrap">
        {products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
  );
}
