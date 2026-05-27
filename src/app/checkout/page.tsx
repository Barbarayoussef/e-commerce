"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosAuth from "@/lib/axiosAuth"; // Your authenticated instance
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UnifiedCheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [addressDetails, setAddressDetails] = useState({
    street: "",
    city: "",
    building: "",
  });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Load the appropriate cart depending on login status
  useEffect(() => {
    if (status === "loading") return; // Wait for NextAuth to finish checking session

    const loadCart = async () => {
      try {
        if (session) {
          // --- LOGGED IN USER: Fetch active cart items from Database ---
          const res = await axiosAuth.get("/cart");
          if (res.data.cart && res.data.cart.products.length > 0) {
            setCartItems(res.data.cart.products);
          } else {
            toast.error("Your cart is empty.");
            router.push("/cart");
          }
        } else {
          // --- GUEST USER: Pull from Browser LocalStorage ---
          const localCart = localStorage.getItem("guest_cart");
          if (localCart) {
            setCartItems(JSON.parse(localCart));
          } else {
            toast.error("Your cart is empty. Add items first!");
            router.push("/products");
          }
        }
      } catch (err) {
        toast.error("Error setting up your checkout session.");
      } finally {
        setPageLoading(false);
      }
    };

    loadCart();
  }, [session, status, router]);

  const handleCheckout = async () => {
    // 1. Enforce Personal Info Validation ONLY for Guest Users
    if (!session) {
      if (
        !guestInfo.name.trim() ||
        !guestInfo.email.trim() ||
        !guestInfo.phone.trim()
      ) {
        toast.error("Please fill out your name, email, and phone number.");
        return;
      }
    }

    // 2. Validate Address fields for absolutely everyone
    if (
      !addressDetails.street.trim() ||
      !addressDetails.city.trim() ||
      !addressDetails.building.trim()
    ) {
      toast.error("Please complete all shipping address fields.");
      return;
    }

    setLoading(true);
    const fullAddress = `${addressDetails.building}, ${addressDetails.street}, ${addressDetails.city}`;

    try {
      if (session) {
        // --- PATH A: Registered User Submission ---
        const res = await axiosAuth.post("/orders/checkout", {
          paymentMethod,
          shippingAddress: fullAddress,
        });

        if (paymentMethod === "card" && res.data.url) {
          window.location.href = res.data.url;
        } else {
          toast.success("Order placed successfully!");
          router.push("/orders");
        }
      } else {
        // --- PATH B: Guest User Submission ---
        const res = await axios.post(
          "http://localhost:5000/api/v1/orders/guest-checkout",
          {
            guestInfo,
            paymentMethod,
            shippingAddress: fullAddress,
            products: cartItems,
          },
        );

        // Safe cleanup for browser memory
        localStorage.removeItem("guest_cart");

        if (paymentMethod === "card" && res.data.url) {
          window.location.href = res.data.url;
        } else {
          toast.success("Guest order successfully registered!");
          router.push(`/orders/success?id=${res.data.order?._id || ""}`);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Checkout execution failed.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading)
    return (
      <div className="text-center py-24 text-muted-foreground">
        Preparing checkout...
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <Card>
        {/* --- CONDITIONAL UI: Only display Contact Info inputs to Guests --- */}
        {!session && (
          <>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Checking out as a guest. Enter your details below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-2">
              <Input
                placeholder="Full Name"
                value={guestInfo.name}
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, name: e.target.value })
                }
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={guestInfo.email}
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, email: e.target.value })
                }
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={guestInfo.phone}
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, phone: e.target.value })
                }
              />
            </CardContent>
          </>
        )}

        {session && (
          <CardHeader>
            <CardTitle>
              Welcome back, {session.user?.name || "Customer"}
            </CardTitle>
            <CardDescription>
              Logged in as {session.user?.email}
            </CardDescription>
          </CardHeader>
        )}

        <CardHeader className={!session ? "pt-4" : "pt-0"}>
          <CardTitle>Payment & Shipping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Toggles */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant={paymentMethod === "cod" ? "default" : "outline"}
              onClick={() => setPaymentMethod("cod")}
              className="flex-1"
            >
              Cash on Delivery
            </Button>
            <Button
              type="button"
              variant={paymentMethod === "card" ? "default" : "outline"}
              onClick={() => setPaymentMethod("card")}
              className="flex-1"
            >
              Pay with Card
            </Button>
          </div>

          {/* Granular Split Address Form fields */}
          <div className="space-y-3 pt-2">
            <Input
              placeholder="Building / Apt / Floor"
              value={addressDetails.building}
              onChange={(e) =>
                setAddressDetails({
                  ...addressDetails,
                  building: e.target.value,
                })
              }
            />
            <Input
              placeholder="Street Name / District"
              value={addressDetails.street}
              onChange={(e) =>
                setAddressDetails({ ...addressDetails, street: e.target.value })
              }
            />
            <Input
              placeholder="City"
              value={addressDetails.city}
              onChange={(e) =>
                setAddressDetails({ ...addressDetails, city: e.target.value })
              }
            />
          </div>

          <Button
            className="w-full mt-4"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : paymentMethod === "card"
                ? "Proceed to Payment"
                : "Place Order"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
