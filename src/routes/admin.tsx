import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { formatNaira } from "@/lib/whatsapp";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Upload, LogOut } from "lucide-react";
import type { Product } from "@/components/ProductCard";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — THREADBYKAY" }] }),
  component: Admin,
});

type FormState = {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: "clothes" | "trousers";
  image_url: string;
  in_stock: boolean;
};

const empty: FormState = {
  name: "", description: "", price: "", category: "clothes", image_url: "", in_stock: true,
};

function Admin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { navigate({ to: "/auth" }); return; }
      setUserId(data.session.user.id);
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", data.session.user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      setAuthReady(true);
    })();
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (f: FormState) => {
      const payload = {
        name: f.name.trim(),
        description: f.description.trim() || null,
        price: Number(f.price),
        category: f.category,
        image_url: f.image_url || null,
        in_stock: f.in_stock,
      };
      if (f.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(form.id ? "Product updated" : "Product added");
      setForm(empty);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["featured-products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product deleted");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["featured-products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleUpload = async (file: File) => {
    if (!userId) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast.success("Image uploaded");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!authReady) {
    return <div className="min-h-screen bg-background"><SiteHeader /><div className="p-10 text-center text-muted-foreground">Loading…</div></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-3xl text-primary">Admin access required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account is signed in but doesn't have the <code className="rounded bg-muted px-1">admin</code> role yet.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Your user ID: <span className="font-mono">{userId}</span></p>
          <p className="mt-2 text-xs text-muted-foreground">
            Ask your developer to run:<br/>
            <code className="mt-1 inline-block rounded bg-muted px-2 py-1">insert into user_roles (user_id, role) values ('{userId}', 'admin');</code>
          </p>
          <button onClick={() => supabase.auth.signOut()} className="mt-6 text-xs uppercase tracking-widest text-primary hover:underline">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">Owner dashboard</p>
            <h1 className="mt-2 font-display text-4xl text-primary">Manage products</h1>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-accent">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[400px_1fr]">
          {/* FORM */}
          <form
            onSubmit={(e) => { e.preventDefault(); upsert.mutate(form); }}
            className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-card"
          >
            <h2 className="font-display text-2xl text-primary">{form.id ? "Edit product" : "Add new product"}</h2>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Price (₦)</label>
                <input required type="number" min="0" step="100" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as "clothes" | "trousers" })}
                  className="mt-1 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm">
                  <option value="clothes">Clothes</option>
                  <option value="trousers">Trousers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Image</label>
              <div className="mt-1 flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-input bg-background px-3 py-2 text-xs uppercase tracking-widest hover:bg-accent">
                  <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload"}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                </label>
                {form.image_url && (
                  <img src={form.image_url} alt="preview" className="h-14 w-14 rounded-sm object-cover" />
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} />
              In stock
            </label>

            <div className="flex gap-2 pt-2">
              <button disabled={upsert.isPending} type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                <Plus className="h-4 w-4" /> {form.id ? "Save changes" : "Add product"}
              </button>
              {form.id && (
                <button type="button" onClick={() => setForm(empty)}
                  className="rounded-sm border border-border px-4 py-3 text-xs uppercase tracking-widest hover:bg-accent">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* LIST */}
          <div>
            <h2 className="font-display text-2xl text-primary">All products ({products?.length ?? 0})</h2>
            <div className="mt-4 space-y-3">
              {products?.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 shadow-card">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-muted">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                      : <div className="flex h-full items-center justify-center text-xs text-muted-foreground/50">TBK</div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.category} · {formatNaira(p.price)} · {p.in_stock ? "In stock" : "Sold out"}
                    </p>
                  </div>
                  <button onClick={() => setForm({
                    id: p.id, name: p.name, description: p.description ?? "",
                    price: String(p.price), category: p.category as "clothes" | "trousers",
                    image_url: p.image_url ?? "", in_stock: p.in_stock,
                  })} className="rounded-sm border border-border p-2 hover:bg-accent" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${p.name}"?`)) del.mutate(p.id); }}
                    className="rounded-sm border border-border p-2 text-destructive hover:bg-destructive/10" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {products && products.length === 0 && (
                <p className="rounded-lg border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
                  No products yet — add your first piece on the left.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
