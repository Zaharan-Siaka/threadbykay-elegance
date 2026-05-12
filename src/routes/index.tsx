import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { ProductCard, type Product } from "@/components/ProductCard";
import { ArrowRight, Truck, Sparkles, MessageCircle } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "THREADBYKAY — Bold Feminine Fashion" },
      { name: "description", content: "THREADBYKAY: elegant, confident clothing & trousers handpicked for the modern woman. Order on WhatsApp." },
      { property: "og:title", content: "THREADBYKAY — Bold Feminine Fashion" },
      { property: "og:description", content: "Elegant, confident clothing handpicked for the modern woman." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: featured } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3 w-3" /> New Season
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-primary sm:text-6xl md:text-7xl">
              Wear your <em className="text-gold not-italic">confidence</em>.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Handcrafted clothing and tailored trousers, made for the woman
              who walks into every room owning it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
              >
                Shop the collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop"
                search={{ category: "trousers" }}
                className="inline-flex items-center gap-2 rounded-sm border border-primary/30 px-6 py-3 text-xs uppercase tracking-[0.2em] text-primary hover:bg-primary/5"
              >
                Explore trousers
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-gold opacity-20 blur-3xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-md shadow-elegant">
              <img
                src={heroImg}
                alt="THREADBYKAY baggy grey joggers"
                width={1280}
                height={1600}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-md bg-card p-5 shadow-card md:block">
              <p className="font-display text-2xl text-primary">100+</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Happy clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <CategoryCard
            title="Clothes"
            blurb="Dresses, tops & elegant statement pieces."
            to="/shop"
            search={{ category: "clothes" }}
            tone="primary"
          />
          <CategoryCard
            title="Trousers"
            blurb="Tailored, flowing & power-cut silhouettes."
            to="/shop"
            search={{ category: "trousers" }}
            tone="gold"
          />
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">Featured</p>
            <h2 className="mt-2 font-display text-4xl text-primary md:text-5xl">New arrivals</h2>
          </div>
          <Link to="/shop" className="text-sm uppercase tracking-widest text-primary hover:text-gold">
            View all →
          </Link>
        </div>
        {featured && featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="font-display text-2xl text-primary">Collection coming soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The owner is curating beautiful new pieces. Check back shortly.
            </p>
          </div>
        )}
      </section>

      {/* PERKS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 rounded-lg border border-border bg-card p-8 shadow-card md:grid-cols-3">
          <Perk icon={<Truck />} title="Nationwide delivery" body="Fast, secure shipping across Nigeria." />
          <Perk icon={<MessageCircle />} title="Personal service" body="Order directly via WhatsApp with Kay." />
          <Perk icon={<Sparkles />} title="Crafted with care" body="Quality fabrics, tailored finishes." />
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}

function CategoryCard({
  title, blurb, to, search, tone,
}: { title: string; blurb: string; to: string; search: object; tone: "primary" | "gold" }) {
  return (
    <Link
      to={to}
      search={search as never}
      className={`group relative flex h-56 flex-col justify-between overflow-hidden rounded-lg p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant ${
        tone === "primary" ? "bg-gradient-hero text-primary-foreground" : "bg-gradient-gold text-gold-foreground"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.25em] opacity-80">Category</p>
      <div>
        <h3 className="font-display text-4xl">{title}</h3>
        <p className="mt-2 max-w-xs text-sm opacity-90">{blurb}</p>
      </div>
      <ArrowRight className="absolute right-6 top-6 h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function Perk({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">{icon}</div>
      <div>
        <p className="font-display text-lg text-primary">{title}</p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
