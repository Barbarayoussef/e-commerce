"use client";

import React, { useState, useEffect } from "react";
import { fetchCategories } from "../_api/fetchCategories.api";
import { Category } from "../_models/category.type";
import CategoryCard from "../_component/categoryCard/page";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "../loading";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  // 1. Logic for Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center text-3xl font-bold mt-4 mb-8 text-foreground">
        Our <span className="text-primary">Categories</span>
      </h1>

      {/* 2. The Grid */}
      <div className="flex gap-6 justify-center flex-wrap min-h-[400px]">
        {currentItems.map((category: Category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>

      {/* 3. Pagination Controls (Luxury Rosewood Style) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-primary/20 hover:bg-primary/10 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5 text-primary" />
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "border-primary/10 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="border-primary/20 hover:bg-primary/10 disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5 text-primary" />
          </Button>
        </div>
      )}
    </div>
  );
}
