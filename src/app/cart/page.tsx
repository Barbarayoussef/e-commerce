"use client";
import React, { useEffect, useState } from "react";
import axiosAuth from "@/lib/axiosAuth";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchCartData = async () => {
    if (status === "loading") return;

    try {
      if (session) {
        // --- Path A: User is logged in -> Load from MongoDB ---
        const res = await axiosAuth.get("/cart");
        setCartProducts(res.data.cart?.products || []);
        setTotalPrice(res.data.cart?.totalCartPrice || 0);
      } else {
        // --- Path B: User is a Guest -> Load from Browser storage ---
        const localCart = localStorage.getItem("guest_cart");
        if (localCart) {
          const parsed = JSON.parse(localCart);
          setCartProducts(parsed);
          setTotalPrice(
            parsed.reduce((sum: number, p: any) => sum + p.totalPrice, 0),
          );
        } else {
          setCartProducts([]);
          setTotalPrice(0);
        }
      }
    } catch (err) {
      console.error("Error reading cart records", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [session, status]);

  // Adjusts item counts locally or on the server dynamically
  const changeQuantity = async (
    productId: string,
    currentQty: number,
    adjustment: number,
  ) => {
    const targetQty = currentQty + adjustment;
    if (targetQty <= 0) return;

    if (session) {
      // Backend MongoDB Update Call API
      await axiosAuth.put("/cart", { productId, quantity: targetQty });
      fetchCartData();
    } else {
      // LocalStorage Sync Update
      const localized = cartProducts.map((p) => {
        if (p.productId === productId) {
          return { ...p, quantity: targetQty, totalPrice: p.price * targetQty };
        }
        return p;
      });
      localStorage.setItem("guest_cart", JSON.stringify(localized));
      fetchCartData();
    }
  };

  const removeProduct = async (productId: string) => {
    if (session) {
      await axiosAuth.delete(`/cart/${productId}`);
      fetchCartData();
    } else {
      const filtered = cartProducts.filter((p) => p.productId !== productId);
      localStorage.setItem("guest_cart", JSON.stringify(filtered));
      fetchCartData();
    }
  };

  if (loading)
    return <div className="text-center py-24">Loading your basket...</div>;

  if (cartProducts.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-bold">Your shopping cart is empty</h2>
        <Link href="/products">
          <Button>Go Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Item List Rows */}
        <div className="md:col-span-2 space-y-4">
          {cartProducts.map((item) => (
            <Card key={item.productId}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    EGP {item.price} each
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        changeQuantity(item.productId, item.quantity, -1)
                      }
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        changeQuantity(item.productId, item.quantity, 1)
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeProduct(item.productId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total Cost card display summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg font-bold border-b pb-2">
                <span>Total Amount</span>
                <span>EGP {totalPrice}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout" className="w-full">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
