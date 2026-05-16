import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/shop", search: { category: "trousers" }, label: "Joggers" },
    { to: "/shop", search: { category: "clothes" }, label: "Tops & polo" },
    { to: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-display text-xl tracking-[0.18em] text-primary">
          THREAD<span className="text-gold">BY</span>KAY
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l, i) => (
            <Link
              key={i}
              to={l.to}
              search={l.search as never}
              className="text-sm uppercase tracking-widest text-foreground/80 transition-colors hover:text-primary"
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col px-4 py-3">
            {links.map((l, i) => (
              <Link
                key={i}
                to={l.to}
                search={l.search as never}
                onClick={() => setOpen(false)}
                className="py-3 text-sm uppercase tracking-widest text-foreground/80"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
