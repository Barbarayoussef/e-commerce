import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-muted/30 pt-16 pb-8 border-t border-border/40 w-full ">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg transition-transform group-hover:rotate-6">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">ShopNow</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your one-stop shop for all things fresh and trendy. We bring the
              best quality products directly to your doorstep with love and
              care.
            </p>
            <div className="flex gap-3 pt-2">
              <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Linkedin className="h-4 w-4" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-primary transition-colors"
                >
                  My Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="hover:text-primary transition-colors"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="hover:text-primary transition-colors"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">
              Customer Service
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">
              Stay Connected
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>123 Commerce St, Cairo, Egypt</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>support@shopnow.com</span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground">
                Subscribe for exclusive offers
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Email address"
                  className="bg-background focus-visible:ring-primary"
                />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Join
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 opacity-50" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-foreground font-medium">ShopNow</span>. Made
            with passion.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex gap-4 items-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                className="h-5 w-auto"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="h-5 w-auto"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                alt="Visa"
                className="h-4 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="h-9 w-9 flex items-center justify-center rounded-full bg-background border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
    >
      {icon}
    </Link>
  );
}
