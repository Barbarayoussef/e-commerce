"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCcw, ShoppingBag } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Visual Error Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping rounded-full bg-destructive/10" />
        <div className="relative bg-destructive/10 p-6 rounded-full">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
      </div>

      {/* Error Message */}
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Oops! Something went wrong
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We encountered an unexpected error while loading this page. Don't worry,
        your cart is safe!
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
        {/* The "Try Again" Button (Secondary) */}
        <Button
          variant="outline"
          onClick={() => reset()}
          className="gap-2 border-primary/20 hover:bg-primary/5 transition-all"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>

        {/* The "Back to Shopping" Button (Primary Vibrant Orange) */}
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
        >
          {/* Added 'flex items-center justify-center gap-2' directly to the Link */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-2"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>

      {/* Subtle Support Link */}
      <p className="mt-12 text-sm text-muted-foreground">
        If this keeps happening, please{" "}
        <Link
          href="/contact"
          className="text-primary hover:underline font-medium"
        >
          contact our support team
        </Link>
      </p>
    </div>
  );
}
