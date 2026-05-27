"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Loading from "@/app/loading";

interface Order {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalOrderPrice: number;
  shippingAddress: string;
  products: {
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
  guestInfo?: { name: string; email: string; phone: string };
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const paymentType = searchParams.get("payment");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/orders/guest/${orderId}`)
      .then((res) => setOrder(res.data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (paymentType === "card") {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground max-w-md">
          Your payment was received. Your order is being processed and you will
          receive a confirmation shortly.
        </p>
        <p className="text-sm text-muted-foreground font-mono">
          Please save this page or screenshot it for reference.
        </p>
        <div className="flex gap-4 pt-4">
          <Link href="/register">
            <Button>Create an Account</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Order not found
        </h2>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Success Header */}
      <div className="flex flex-col items-center text-center mb-10 space-y-3">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you{order.guestInfo?.name ? `, ${order.guestInfo.name}` : ""}!
          Your order has been placed successfully.
        </p>
        <p className="text-sm text-muted-foreground">
          Order reference:{" "}
          <span className="font-mono font-bold text-foreground">
            #{order._id.slice(-8).toUpperCase()}
          </span>
        </p>
      </div>

      {/* Order Details */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order Summary</span>
            <div className="flex gap-2">
              <Badge
                variant={
                  order.paymentStatus === "paid" ? "default" : "secondary"
                }
              >
                {order.paymentStatus}
              </Badge>
              <Badge variant="secondary">{order.orderStatus}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.products.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.name}{" "}
                <span className="text-muted-foreground">× {item.quantity}</span>
              </span>
              <span className="font-medium">EGP {item.totalPrice}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>EGP {order.totalOrderPrice}</span>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress}
          </p>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {order.paymentMethod === "cod"
              ? "Cash on Delivery"
              : "Card Payment"}
          </p>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-col items-center space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Want to track your orders and get a better experience?
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <Button>Create an Account</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
