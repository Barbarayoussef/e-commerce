"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react"; // Using Lucide for consistency
import { signOut, useSession } from "next-auth/react";

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
      {badge ? (
        <span className="absolute -top-2 -right-3 bg-destructive text-destructive-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
          {badge}
        </span>
      ) : null}
    </Link>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
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
          <NavItem href="/categories">Categories</NavItem>
          <NavItem href="/brands">Brands</NavItem>
          <NavItem href="/order">Orders</NavItem>
          <NavItem href="/wishlist">Wishlist</NavItem>
          {session.status === "authenticated" && (
            <NavItem href="/cart">Cart</NavItem>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 border-r pr-4 border-border">
            <Instagram className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
            <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {session.status === "authenticated" ? (
              <Link
                onClick={handleLogOut}
                href="/login"
                className="px-4 py-2 text-sm font-medium hover:text-primary"
              >
                logout
              </Link>
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
            {session.status === "authenticated" && (
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                Cart (3)
              </Link>
            )}

            <hr />
            {session.status === "authenticated" ? (
              <Link href="/login" className="font-bold" onClick={handleLogOut}>
                logout
              </Link>
            ) : (
              <>
                <Link href="/login" className="font-bold">
                  Login
                </Link>
                <Link href="/register" className="text-primary font-bold">
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
