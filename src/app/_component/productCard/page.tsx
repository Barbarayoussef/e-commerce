import React from "react";
import { Product } from "../_models/product.type";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart } from "lucide-react";
import { Category } from "../_models/category.type";
type Props = {
  product: Product;
  categories: Category[];
};

export default function ProductCard({ product, categories }: Props) {
  console.log(categories[0]._id);
  console.log(product);

  return (
    <Card className="overflow-hidden flex flex-col h-full group w-64 my-3 ">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <Badge className="bg-red-500 hover:bg-red-600 w-fit">Sale</Badge>
            <Badge variant="destructive" className="w-fit">
              Low Stock
            </Badge>
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {
                  categories.find(
                    (category) => category._id == product.category,
                  )?.name
                }
              </p>

              <CardTitle
                className="text-base font-bold line-clamp-1 mt-1"
                title={product.title}
              >
                {product.title}
              </CardTitle>
            </div>

            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded text-yellow-700 dark:text-yellow-400 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold">{product.ratingAvg}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 py-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>

          <div className="mt-4 flex gap-x-5 items-center">
            <span className="font-bold text-lg">EGP {product.price}</span>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-2 gap-2 border-t-0">
        <Button className="flex-1">Add to Cart</Button>

        <Button
          variant="outline"
          size="icon"
          className="shrink-0 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
