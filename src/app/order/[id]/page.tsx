"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosAuth from "@/lib/axiosAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  ShoppingBag,
  Calendar,
  Building,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import Loading from "../../loading";

interface ProductItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  _id: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "cod" | "card";
  totalOrderPrice: number;
  orderDate: string;
  shippingAddress: string;
  products: ProductItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      axiosAuth
        .get(`/orders/${params.id}`)
        .then((res) => {
          setOrder(res.data.order);
        })
        .catch((err) => {
          toast.error(
            err.response?.data?.message || "Failed to load order details",
          );
          router.push("/order");
        })
        .finally(() => setLoading(false));
    }
  }, [params.id, router]);

  if (loading) return <Loading />;
  if (!order) return <div className="text-center py-24">Order not found.</div>;

  // HELPER FIX: Splits the stored comma string safely back into structured components
  // UPDATE this helper function inside your OrderDetailsPage component:
  const parseAddress = (addressStr: string) => {
    if (!addressStr) return { building: "N/A", street: "N/A", city: "N/A" };

    // 1. Check if the database string is a raw JSON block from Stripe
    if (addressStr.trim().startsWith("{")) {
      try {
        const stripeAddress = JSON.parse(addressStr);
        return {
          building: stripeAddress.line2 || "N/A",
          street: stripeAddress.line1 || "Custom Card Payment Address",
          city: stripeAddress.city || "N/A",
        };
      } catch (e) {
        // Fallback if JSON parsing fails
      }
    }

    // 2. Standard comma-splitting fallback for clean text values
    const parts = addressStr.split(",");
    return {
      building: parts[0]?.trim() || "N/A",
      street: parts[1]?.trim() || "N/A",
      city: parts[2]?.trim() || "N/A",
    };
  };

  const address = parseAddress(order.shippingAddress);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipped":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => router.push("/order")}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Placed on{" "}
            {new Date(order.orderDate).toLocaleDateString("en-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant={getStatusVariant(order.orderStatus)}
            className="capitalize px-3 py-1 text-sm"
          >
            Status: {order.orderStatus}
          </Badge>
          <Badge
            variant={order.paymentStatus === "paid" ? "default" : "destructive"}
            className="capitalize px-3 py-1 text-sm"
          >
            Payment: {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> Items Ordered
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {order.products.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <h4 className="font-semibold text-base">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Quantity: {item.quantity} × EGP {item.price}
                  </p>
                </div>
                <p className="font-medium text-base">
                  EGP {item.price * item.quantity}
                </p>
              </div>
            ))}

            <div className="pt-4 mt-4 flex justify-between items-center text-lg font-bold">
              <span>Total Price</span>
              <span className="text-primary">EGP {order.totalOrderPrice}</span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping & Payment Meta Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FIX: Visually Splitted Shipping Address Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" /> Delivery
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 bg-muted/40 p-4 rounded-lg border border-border text-sm">
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block uppercase tracking-wider">
                      Building / Apt
                    </span>
                    <p className="font-medium text-foreground">
                      {address.building}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block uppercase tracking-wider">
                      Street / District
                    </span>
                    <p className="font-medium text-foreground">
                      {address.street}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block uppercase tracking-wider">
                      City
                    </span>
                    <p className="font-medium text-foreground">
                      {address.city}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-muted-foreground" /> Payment
                Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-4 bg-muted/40 p-4 rounded-lg border border-border h-[178px] flex flex-col justify-center">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block uppercase tracking-wider">
                    Method
                  </span>
                  <p className="font-medium text-foreground capitalize">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery (COD)"
                      : "Credit / Debit Card"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block uppercase tracking-wider">
                    Status
                  </span>
                  <p className="font-medium text-foreground capitalize">
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
