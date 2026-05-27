"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Loading from "../loading";

interface Order {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalOrderPrice: number;
  orderDate: string;
  products: { name: string; quantity: number; price: number }[];
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (session) {
          const res = await axiosAuth.get("/orders");
          setOrders(res.data.orders || []);
        } else {
          const stored = localStorage.getItem("guest_orders");
          if (stored) {
            const orderIds: string[] = JSON.parse(stored);
            const results = await Promise.all(
              orderIds.map((id) =>
                axios
                  .get(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/guest/${id}`)
                  .then((res) => res.data.order)
                  .catch(() => null),
              ),
            );
            setOrders(results.filter(Boolean));
          }
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [session]);

  if (loading) return <Loading />;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          No orders yet
        </h2>
        <Link href="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                Order #{order._id.slice(-6).toUpperCase()}
              </CardTitle>
              <div className="flex gap-2">
                <Badge
                  variant={
                    order.orderStatus === "delivered" ? "default" : "secondary"
                  }
                >
                  {order.orderStatus}
                </Badge>
                <Badge
                  variant={
                    order.paymentStatus === "paid" ? "default" : "destructive"
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm text-muted-foreground">
                {order.products.map((item, i) => (
                  <p key={i}>
                    {item.name} × {item.quantity} — EGP {item.price}
                  </p>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="font-bold">Total: EGP {order.totalOrderPrice}</p>
                <Link
                  href={
                    session
                      ? `/order/${order._id}`
                      : `/order/success?id=${order._id}`
                  }
                >
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
