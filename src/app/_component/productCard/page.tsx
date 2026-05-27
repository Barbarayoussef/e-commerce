"use client";
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
import { useSession } from "next-auth/react";
import axiosAuth from "@/lib/axiosAuth";
import { toast } from "sonner";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { data: session } = useSession();

  const addToCart = async () => {
    if (session) {
      // --- LOGGED IN USER: Save to MongoDB ---
      try {
        await axiosAuth.post("/cart", { productId: product._id });
        toast.success("Added to cart!");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to add to cart");
      }
    } else {
      // --- GUEST USER: Save to Browser LocalStorage (No Login Required!) ---
      try {
        const localCart = localStorage.getItem("guest_cart");
        let currentCart = localCart ? JSON.parse(localCart) : [];

        const existingIndex = currentCart.findIndex(
          (item: any) => item.productId === product._id,
        );

        if (existingIndex > -1) {
          currentCart[existingIndex].quantity += 1;
          currentCart[existingIndex].totalPrice =
            currentCart[existingIndex].quantity *
            currentCart[existingIndex].price;
        } else {
          currentCart.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            totalPrice: product.price,
          });
        }

        localStorage.setItem("guest_cart", JSON.stringify(currentCart));
        toast.success("Added to guest cart!");

        // Fire a global event to tell the navbar component to recount items immediately
        window.dispatchEvent(new Event("cart-updated"));
      } catch (error) {
        toast.error("Failed to update guest cart.");
      }
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full group w-64 my-3">
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name || "Product image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="destructive" className="w-fit">
                Low Stock
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive" className="w-fit">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {product.categoryName}
              </p>
              <CardTitle
                className="text-base font-bold line-clamp-1 mt-1"
                title={product.name}
              >
                {product.name}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded text-yellow-700 dark:text-yellow-400 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold">N/A</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 py-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
          <div className="mt-4 flex gap-x-5 items-center">
            <span className="font-bold text-lg">EGP {product.price}</span>
            {product.stock === 0 && (
              <span className="text-xs text-red-500 font-medium">
                Out of stock
              </span>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-2 gap-2 border-t-0">
        <Button
          className="flex-1"
          disabled={product.stock === 0}
          onClick={addToCart}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
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
