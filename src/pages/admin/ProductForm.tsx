import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Product, ProductCategory } from "@/types";
import {
  CATEGORIES,
  PRODUCT_COLORS,
  PRODUCT_SIZES,
  PRODUCT_TAGS,
} from "@/data/products";
import {
  createOrUpdateProduct,
  uploadProductImage,
} from "@/lib/products-db";

interface Props {
  /** Product being edited, or null to create a new one. */
  initial: Product | null;
  /** All existing ids — used to generate a fresh id for new products. */
  existingIds: number[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export function ProductForm({ initial, existingIds, onClose, onSaved }: Props) {
  const isRange = Array.isArray(initial?.price);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(initial));
  const [category, setCategory] = useState<ProductCategory>(initial?.category ?? "Dresses");
  const [variablePrice, setVariablePrice] = useState(isRange);
  const [price, setPrice] = useState(
    typeof initial?.price === "number" ? String(initial.price) : "",
  );
  const [priceMin, setPriceMin] = useState(
    Array.isArray(initial?.price) ? String(initial.price[0]) : "",
  );
  const [priceMax, setPriceMax] = useState(
    Array.isArray(initial?.price) ? String(initial.price[1]) : "",
  );
  const [image, setImage] = useState(initial?.image ?? "");
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [colors, setColors] = useState<string[]>(initial?.colors ?? []);
  const [sizes, setSizes] = useState<string[]>(initial?.sizes ?? []);
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [onSale, setOnSale] = useState(initial?.onSale ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [hasVariants, setHasVariants] = useState(initial?.hasVariants ?? false);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [fabric, setFabric] = useState(initial?.fabric ?? "");
  const [careInstructions, setCareInstructions] = useState(initial?.careInstructions ?? "");
  const [weightKg, setWeightKg] = useState(initial?.weightKg ?? "");
  const [shippingWeightKg, setShippingWeightKg] = useState(
    initial?.shippingWeightKg != null ? String(initial.shippingWeightKg) : "",
  );
  const [dimensions, setDimensions] = useState(initial?.dimensions ?? "");
  const [priceNote, setPriceNote] = useState(initial?.priceNote ?? "");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  const effectiveSlug = slug || slugify(name) || "product";

  const handleName = (value: string) => {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  };

  const handleMainImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadProductImage(file, effectiveSlug);
      setImage(url);
      setGallery((g) => (g.includes(url) ? g : [...g, url]));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Image upload failed. Check Storage is enabled and try again.";
      setError(msg);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleGallery = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadProductImage(f, effectiveSlug)));
      setGallery((g) => [...g, ...urls]);
      if (!image && urls[0]) setImage(urls[0]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "One or more images failed to upload.";
      setError(msg);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (url: string) => {
    setGallery((g) => {
      const next = g.filter((u) => u !== url);
      if (image === url) {
        setImage(next[0] ?? "");
      }
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Name is required.");

    let finalPrice: Product["price"];
    if (variablePrice) {
      const lo = Number(priceMin);
      const hi = Number(priceMax);
      if (!lo || !hi || lo > hi) return setError("Enter a valid price range (min ≤ max).");
      finalPrice = [lo, hi];
    } else {
      const p = Number(price);
      if (!p) return setError("Enter a valid price.");
      finalPrice = p;
    }

    const id = initial?.id ?? (existingIds.length ? Math.max(...existingIds) + 1 : 1);

    const product: Product = {
      id,
      slug: effectiveSlug,
      name: name.trim(),
      price: finalPrice,
      image: image || "",
      gallery: gallery.filter(Boolean),
      category,
      tags,
      colors,
      sizes,
      inStock,
      onSale,
      featured,
      hasVariants,
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(fabric.trim() ? { fabric: fabric.trim() } : {}),
      ...(careInstructions.trim() ? { careInstructions: careInstructions.trim() } : {}),
      ...(weightKg.trim() ? { weightKg: weightKg.trim() } : {}),
      ...(shippingWeightKg ? { shippingWeightKg: Number(shippingWeightKg) } : {}),
      ...(dimensions.trim() ? { dimensions: dimensions.trim() } : {}),
      ...(priceNote.trim() ? { priceNote: priceNote.trim() } : {}),
    };

    setSaving(true);
    try {
      await createOrUpdateProduct(product);
      onSaved(initial ? "Product updated." : "Product added.");
    } catch (err) {
      console.error("Save error:", err);
      const msg = err instanceof Error ? err.message : "Could not save. Check your connection and permissions.";
      setError(msg);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="my-8 w-full max-w-2xl rounded-card border border-mist bg-bone p-6 dark:border-edge dark:bg-ink"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">
            {initial ? "Edit product" : "New product"}
          </h2>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-ink/50 hover:text-ink dark:text-bone/50 dark:hover:text-bone">
            ×
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2">
            <input value={name} onChange={(e) => handleName(e.target.value)} className="input-field" required />
          </Field>

          <Field label="Slug (URL)">
            <input
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugEdited(true);
              }}
              placeholder={slugify(name) || "product"}
              className="input-field"
            />
          </Field>

          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)} className="input-field">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Pricing */}
        <div className="mt-4">
          <CheckRow label="Variable price (range)" checked={variablePrice} onChange={setVariablePrice} />
          {variablePrice ? (
            <div className="mt-2 grid grid-cols-2 gap-4">
              <Field label="Price min (₦)">
                <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="input-field" />
              </Field>
              <Field label="Price max (₦)">
                <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="input-field" />
              </Field>
            </div>
          ) : (
            <Field label="Price (₦)" className="mt-2">
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" />
            </Field>
          )}
          <Field label="Price note (optional)" className="mt-2">
            <input value={priceNote} onChange={(e) => setPriceNote(e.target.value)} placeholder="e.g. Sizes XS–L: ₦130,000 · L–2XL: ₦150,000" className="input-field" />
          </Field>
        </div>

        {/* Images */}
        <div className="mt-4">
          <span className="block text-sm font-semibold">Images</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {gallery.map((url) => (
              <div key={url} className="relative h-24 w-20 overflow-hidden rounded-card border border-mist dark:border-edge">
                <img src={url} alt="" className="h-full w-full object-cover" />
                {url === image ? (
                  <span className="absolute bottom-0 left-0 right-0 bg-gold py-0.5 text-center text-[10px] font-semibold text-ink">Main</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setImage(url)}
                    className="absolute bottom-0 left-0 right-0 bg-ink/70 py-0.5 text-center text-[10px] text-bone hover:bg-ink"
                  >
                    Set main
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute right-0 top-0 bg-ink/70 px-1.5 text-xs text-bone hover:bg-sale"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <label className="btn-ghost cursor-pointer">
              {image ? "Replace main image" : "Upload main image"}
              <input type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
            </label>
            <label className="btn-ghost cursor-pointer">
              Add gallery images
              <input type="file" accept="image/*" multiple onChange={handleGallery} className="hidden" />
            </label>
            {uploading && <span className="text-ink/50 dark:text-bone/50">Uploading…</span>}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Or enter main image URL">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = imageUrlInput.trim();
                    if (val) {
                      setImage(val);
                      setGallery((g) => (g.includes(val) ? g : [...g, val]));
                      setImageUrlInput("");
                    }
                  }}
                  className="btn bg-gold text-ink hover:bg-[#fda437] hover:text-white px-4 py-2 text-xs"
                >
                  Apply
                </button>
              </div>
            </Field>
            <Field label="Or enter gallery image URL">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = galleryUrlInput.trim();
                    if (val) {
                      setGallery((g) => [...g, val]);
                      if (!image) setImage(val);
                      setGalleryUrlInput("");
                    }
                  }}
                  className="btn bg-gold text-ink hover:bg-[#fda437] hover:text-white px-4 py-2 text-xs"
                >
                  Add
                </button>
              </div>
            </Field>
          </div>
        </div>

        {/* Attributes */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <PillGroup label="Colors" options={PRODUCT_COLORS} selected={colors} onToggle={(v) => setColors((c) => toggle(c, v))} />
          <PillGroup label="Sizes" options={PRODUCT_SIZES} selected={sizes} onToggle={(v) => setSizes((s) => toggle(s, v))} />
          <PillGroup label="Tags" options={PRODUCT_TAGS} selected={tags} onToggle={(v) => setTags((t) => toggle(t, v))} />
        </div>

        {/* Flags */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <CheckRow label="In stock" checked={inStock} onChange={setInStock} />
          <CheckRow label="On sale" checked={onSale} onChange={setOnSale} />
          <CheckRow label="Featured" checked={featured} onChange={setFeatured} />
          <CheckRow label="Has variants" checked={hasVariants} onChange={setHasVariants} />
        </div>

        {/* Details */}
        <Field label="Description" className="mt-4">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="input-field" />
        </Field>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Fabric"><input value={fabric} onChange={(e) => setFabric(e.target.value)} className="input-field" /></Field>
          <Field label="Care instructions"><input value={careInstructions} onChange={(e) => setCareInstructions(e.target.value)} className="input-field" /></Field>
          <Field label="Weight (display, e.g. 1.2 – 1.7 kg)"><input value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="input-field" /></Field>
          <Field label="Shipping weight (kg)"><input type="number" step="0.1" value={shippingWeightKg} onChange={(e) => setShippingWeightKg(e.target.value)} className="input-field" /></Field>
          <Field label="Dimensions" className="sm:col-span-2"><input value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="Length: 118 cm · Width: 31 cm" className="input-field" /></Field>
        </div>

        {error && <p className="mt-4 text-sm text-sale">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-60">
            {saving ? "Saving…" : initial ? "Save changes" : "Add product"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-gold" />
      {label}
    </label>
  );
}

function PillGroup({ label, options, selected, onToggle }: { label: string; options: readonly string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`rounded-card border px-2 py-1 text-xs ${
                active
                  ? "border-gold bg-gold text-ink"
                  : "border-mist text-ink/70 hover:border-gold dark:border-edge dark:text-bone/70"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
