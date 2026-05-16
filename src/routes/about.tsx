import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — THREADBYKAY" },
      { name: "description", content: "The story behind THREADBYKAY: premium unisex joggers and streetwear crafted with intention." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold">Our story</p>
        <h1 className="mt-3 font-display text-5xl text-primary md:text-6xl">
          Joggers and streetwear, built for everyone.
        </h1>
        <div className="prose prose-lg mt-8 max-w-none text-muted-foreground">
          <p>
            THREADBYKAY is a kogi-rooted streetwear label founded by SIAKA ORAHACHI BARAKAT on one belief:
            what you wear should feel like you — comfortable, confident, and
            unmistakably yours.
          </p>
          <p>
            We deal in unisex joggers,polos and everyday accesories in really affordable prices
            our productss are made with quality fabrics, clean cuts, and fits that work on every body. Baggy,
            tapered, relaxed — pieces made to move with you.
          </p>
          <p>
            Place your order directly with Kay on WhatsApp. We'll guide you
            through sizing, colours, and delivery anywhere in Nigeria.
          </p>
        </div>
      </section>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
