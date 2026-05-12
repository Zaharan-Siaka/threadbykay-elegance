import { whatsappLink, formatNaira } from "@/lib/whatsapp";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  in_stock: boolean;
};

export function ProductCard({ product }: { product: Product }) {
  const msg = `Hi THREADBYKAY, I'd like to order "${product.name}" (${formatNaira(product.price)}).`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-muted-foreground/40">
            TBK
          </div>
        )}
        {!product.in_stock && (
          <span className="absolute left-3 top-3 rounded-sm bg-foreground/90 px-2 py-1 text-[10px] uppercase tracking-widest text-background">
            Sold out
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-sm bg-background/90 px-2 py-1 text-[10px] uppercase tracking-widest text-foreground">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg leading-tight">{product.name}</h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="font-display text-xl text-primary">{formatNaira(product.price)}</span>
          <a
            href={whatsappLink(msg)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Order
          </a>
        </div>
      </div>
    </article>
  );
}
