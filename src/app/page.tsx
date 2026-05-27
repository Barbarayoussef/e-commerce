import React from "react";
import { fetchProducts } from ".././app/_api/fetchProducts.api";
import { Product } from ".././app/_component/_models/product.type";
import ProductCard from "../app/_component/productCard/page";
import { fetchCategories } from ".././app/_api/fetchCategories.api";
export default async function Home() {
  const products = await fetchProducts();
  console.log(products);
  const categories = await fetchCategories();

  return (
    <>
      <h1 className="text-center text-2xl ">Common Products</h1>
      <div className="flex gap-4 justify-center flex-wrap ">
        {products.map((product: Product) => (
          <ProductCard
            key={product._id}
            product={product}
            categories={categories}
          ></ProductCard>
        ))}
      </div>
    </>
  );
}
