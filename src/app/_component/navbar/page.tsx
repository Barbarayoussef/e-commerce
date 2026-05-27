"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Instagram, Twitter } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import axiosAuth from "@/lib/axiosAuth";

const NavItem = ({
  href,
  children,
  badge,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  badge?: number;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative py-1 transition-colors ${
        isActive
          ? "text-primary font-semibold"
          : "text-muted-foreground hover:text-primary"
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
      {badge && badge > 0 ? (
        <span className="absolute -top-2 -right-4 bg-destructive text-destructive-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
          {badge}
        </span>
      ) : null}
    </Link>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [cartCount, setCartCount] = useState<number>(0);

  // Memoize the counter function to efficiently handle counts for both states
  const updateCartCount = useCallback(async () => {
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      // Fetch totals from Database for Logged-In Users
      try {
        const res = await axiosAuth.get("/cart");
        const items = res.data.cart?.products || [];
        const total = items.reduce(
          (sum: number, p: any) => sum + p.quantity,
          0,
        );
        setCartCount(total);
      } catch (err) {
        setCartCount(0);
      }
    } else {
      // Compute totals from LocalStorage for Guest Users
      const localCart = localStorage.getItem("guest_cart");
      if (localCart) {
        const parsed = JSON.parse(localCart);
        const total = parsed.reduce(
          (sum: number, p: any) => sum + p.quantity,
          0,
        );
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    }
  }, [session, status]);

  useEffect(() => {
    updateCartCount();

    // Listen for custom button events fired from Product Cards
    window.addEventListener("cart-updated", updateCartCount);
    return () => window.removeEventListener("cart-updated", updateCartCount);
  }, [updateCartCount]);

  function handleLogOut() {
    signOut({ callbackUrl: "/login" });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            ShopNow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <NavItem href="/">Home</NavItem>
          <NavItem href="/products">Shop</NavItem>
          <NavItem href="/categories">Brands</NavItem>
          <NavItem href="/order">Orders</NavItem>
          <NavItem href="/wishlist">Wishlist</NavItem>
          {/* FIX: Permanently rendered for all users, passing a dynamic state badge */}
          <NavItem href="/cart" badge={cartCount}>
            Cart
          </NavItem>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 border-r pr-4 border-border">
            <Instagram className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
            <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {status === "authenticated" ? (
              <button
                onClick={handleLogOut}
                className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-background border-b p-4 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4 text-center">
            <Link href="/products" onClick={() => setIsOpen(false)}>
              Products
            </Link>
            <Link href="/categories" onClick={() => setIsOpen(false)}>
              Categories
            </Link>
            {/* FIX: Mobile Cart now accessible with accurate client state length values */}
            <Link href="/cart" onClick={() => setIsOpen(false)}>
              Cart ({cartCount})
            </Link>

            <hr />
            {status === "authenticated" ? (
              <button
                className="font-bold text-center block w-full py-2"
                onClick={handleLogOut}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-primary font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
