import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — THREADBYKAY" },
      { name: "description", content: "The story behind THREADBYKAY: confident, feminine fashion crafted with intention." },
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
          Designed for the woman who knows.
        </h1>
        <div className="prose prose-lg mt-8 max-w-none text-muted-foreground">
          <p>
            THREADBYKAY is a Lagos-rooted fashion house built on one belief:
            what you wear should make you feel powerful, beautiful, and
            unmistakably yourself.
          </p>
          <p>
            Every piece — from our flowing dresses to our tailored trousers —
            is curated and finished by hand. We choose fabrics that move with
            you, silhouettes that flatter, and details that linger.
          </p>
          <p>
            Place your order directly with Kay on WhatsApp. We'll guide you
            through sizing, fabric choices, and delivery anywhere in Nigeria.
          </p>
        </div>
      </section>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
