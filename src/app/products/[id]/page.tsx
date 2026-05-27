"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import axiosAuth from "@/lib/axiosAuth";
import { toast } from "sonner";

export default function ProductDetails() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  const addToCart = async () => {
    if (!product) return;
    if (session) {
      try {
        await axiosAuth.post("/cart", { productId: product._id });
        toast.success("Added to cart!");
        window.dispatchEvent(new Event("cart-updated"));
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to add to cart");
      }
    } else {
      const localCart = localStorage.getItem("guest_cart");
      const currentCart = localCart ? JSON.parse(localCart) : [];
      const existingIndex = currentCart.findIndex(
        (item: any) => item.productId === product._id,
      );
      if (existingIndex > -1) {
        currentCart[existingIndex].quantity += 1;
        currentCart[existingIndex].totalPrice =
          currentCart[existingIndex].quantity * currentCart[existingIndex].price;
      } else {
        currentCart.push({
          productId: product._id,
          name: product.name || product.title,
          price: product.price,
          quantity: 1,
          totalPrice: product.price,
        });
      }
      localStorage.setItem("guest_cart", JSON.stringify(currentCart));
      toast.success("Added to guest cart!");
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
        );
        console.log(res.data);
        setProduct(res.data.product);
        setActiveImage(res.data.product.imageCover);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <ProductDetailsSkeleton />;
  if (!product)
    return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-border/40 shadow-sm">
            <Image
              src={activeImage}
              alt={product.title}
              fill
              className="object-contain p-8"
            />
          </div>
          {/* Thumbnail Strip */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[product.imageCover, ...product.images].map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                  activeImage === img
                    ? "border-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="thumb" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col space-y-6">
          <div>
            <Badge
              variant="outline"
              className="text-primary border-primary/20 mb-4"
            >
              low stock
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {product.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold text-foreground">
                  {product.ratingAvg || "4.8"}
                </span>
              </div>
              <span className="text-muted-foreground text-sm">
                ({product.sold} sold)
              </span>
              <Badge
                className={
                  product.stock > 0
                    ? "bg-emerald-500/10 text-emerald-600 border-none"
                    : "bg-red-500/10 text-red-600"
                }
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">
              EGP {product.price.toLocaleString()}
            </span>
            {product.priceAfterDiscount > 0 && (
              <span className="text-xl text-muted-foreground line-through">
                EGP {product.priceAfterDiscount}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/40">
            <Button
              className="flex-1 h-14 text-lg bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20"
              onClick={addToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              className="h-14 w-14 border-border/60 hover:bg-rose-50 hover:text-primary"
              onClick={() => toast.info("Wishlist feature coming soon!")}
            >
              <Heart className="w-6 h-6" />
            </Button>
          </div>

          {/* Luxury Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Fast Delivery
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Secure Pay
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                30-Day Returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Skeleton for loading
function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
