import React from "react";
import { Category } from "../_models/category.type";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full group w-64 my-5 ">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={category.image || "/placeholder.png"}
          alt={category.name || "Category image"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4 py-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {category.name}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t-0">
        <Link href={`/categories/${category._id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90">
            See Products
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
