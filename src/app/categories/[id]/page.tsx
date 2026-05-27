"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Product } from "@/app/_component/_models/product.type";
import { Category } from "@/app/_component/_models/category.type";
import ProductCard from "@/app/_component/productCard/page";
import Loading from "@/app/loading";

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const [productsRes, categoryRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/products/category/${id}`,
          ),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/all`),
        ]);
        setProducts(productsRes.data.data || []);
        const categories = categoryRes.data.categories || [];
        setCategory(categories.find((cat: Category) => cat._id === id) || null);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  if (loading) return <Loading />;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          No products found in{" "}
          <span className="text-primary italic">{category?.name}</span>
        </h2>
        <p className="text-sm opacity-70">Try checking another category!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          {category?.name}
        </h1>
        <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        <p className="text-muted-foreground">
          Showing {products.length} Products
        </p>
      </div>
      <div className="flex gap-6 justify-center flex-wrap">
        {products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
