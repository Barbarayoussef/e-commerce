"use client";

import React, { useEffect, useState } from "react";
import { fetchProducts } from "@/app/_api/fetchProducts.api";
import { fetchCategories } from "@/app/_api/fetchCategories.api";
import { useParams } from "next/navigation";
import { Product } from "@/app/_component/_models/product.type";
import { Category } from "@/app/_component/_models/category.type"; // Ensure you import this
import ProductCard from "@/app/_component/productCard/page";
import Loading from "@/app/loading"; // Use your premium loader

export default function CategoryPage() {
  const { id } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        // Fetch both in parallel for speed
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === id,
  );

  const category = categories.find((cat) => cat._id === id);

  if (loading) return <Loading />;

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          No products found in{" "}
          <span className="text-primary italic">`{category?.name}`</span>
        </h2>
        <p className="text-sm opacity-70">Try checking another category!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header with Luxury Rosewood styling */}
      <div className="mb-12 text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          {category?.name}
        </h1>
        <div className="h-1 w-20 bg-primary mx-auto rounded-full" />{" "}
        {/* Accent line */}
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} Products
        </p>
      </div>

      <div className="flex gap-6 justify-center flex-wrap">
        {filteredProducts.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            categories={categories}
          />
        ))}
      </div>
    </div>
  );
}
