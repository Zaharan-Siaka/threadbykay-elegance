import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl tracking-[0.18em] text-primary">
            THREAD<span className="text-gold">BY</span>KAY
          </p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Confident, feminine clothing crafted for the modern woman.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-primary">All pieces</Link></li>
            <li><Link to="/shop" search={{ category: "clothes" }} className="hover:text-primary">Clothes</Link></li>
            <li><Link to="/shop" search={{ category: "trousers" }} className="hover:text-primary">Trousers</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={whatsappLink("Hi THREADBYKAY, I'd like to place an order.")} target="_blank" rel="noreferrer" className="hover:text-primary">
                WhatsApp orders
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} THREADBYKAY. All rights reserved.
      </div>
    </footer>
  );
}
