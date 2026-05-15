import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { ProductCard, type Product } from "@/components/ProductCard";

const search = z.object({
  category: z.enum(["all", "clothes", "trousers"]).catch("all"),
});

export const Route = createFileRoute("/shop")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Shop Joggers — THREADBYKAY" },
      { name: "description", content: "Browse THREADBYKAY's full collection of unisex joggers, tops and sets. Order via WhatsApp." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let q = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (category !== "all") q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const tabs = [
    { key: "all", label: "All" },
    { key: "trousers", label: "Joggers" },
    { key: "clothes", label: "Tops & Sets" },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">The Collection</p>
          <h1 className="mt-3 font-display text-5xl text-primary md:text-6xl">Shop THREADBYKAY</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Unisex joggers and everyday streetwear. Tap any item to order on WhatsApp.
          </p>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {tabs.map((t) => (
            <Link
              key={t.key}
              to="/shop"
              search={{ category: t.key }}
              className={`rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                category === t.key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:bg-accent"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <div className="mt-12">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : data && data.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card/50 p-16 text-center">
              <p className="font-display text-2xl text-primary">Nothing here yet</p>
              <p className="mt-2 text-sm text-muted-foreground">New pieces are on the way.</p>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
