import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Product, ProductCategory } from "@/types";
import {
  CATEGORIES,
  PRODUCT_COLORS,
  PRODUCT_LENGTHS,
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

  const LENGTH_CATEGORIES: string[] = ["Bubu", "Dresses", "Pants", "2-pieces"];
  const initialCat = initial?.category ?? "Dresses";

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(initial));
  const [category, setCategory] = useState<ProductCategory>(initialCat);
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
  const [lengths, setLengths] = useState<string[]>(
    initial?.lengths && initial.lengths.length > 0
      ? initial.lengths
      : LENGTH_CATEGORIES.includes(initialCat)
      ? ["Short", "Regular", "Tall"]
      : [],
  );

  const handleCategoryChange = (newCat: ProductCategory) => {
    setCategory(newCat);
    if (LENGTH_CATEGORIES.includes(newCat) && lengths.length === 0) {
      setLengths(["Short", "Regular", "Tall"]);
    }
  };
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
  const [variantStock, setVariantStock] = useState<{
    sizes?: Record<string, boolean>;
    colors?: Record<string, boolean>;
    lengths?: Record<string, boolean>;
  }>(initial?.variantStock ?? {});
  const [hasColorImages, setHasColorImages] = useState(initial?.hasColorImages ?? false);
  const [colorImages, setColorImages] = useState<Record<string, string[]>>(initial?.colorImages ?? {});
  const [colorUploading, setColorUploading] = useState<Record<string, boolean>>({});
  const [colorUrlInputs, setColorUrlInputs] = useState<Record<string, string>>({});

  const [hasLengthImages, setHasLengthImages] = useState(initial?.hasLengthImages ?? false);
  const [lengthImages, setLengthImages] = useState<Record<string, string[]>>(initial?.lengthImages ?? {});
  const [lengthUploading, setLengthUploading] = useState<Record<string, boolean>>({});
  const [lengthUrlInputs, setLengthUrlInputs] = useState<Record<string, string>>({});

  const [hasCombinedVariantImages, setHasCombinedVariantImages] = useState(initial?.hasCombinedVariantImages ?? false);
  const [combinedVariantImages, setCombinedVariantImages] = useState<Record<string, string[]>>(initial?.combinedVariantImages ?? {});
  const [combinedUploading, setCombinedUploading] = useState<Record<string, boolean>>({});
  const [combinedUrlInputs, setCombinedUrlInputs] = useState<Record<string, string>>({});

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

  const handleColorImagesUpload = async (color: string, e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setColorUploading((prev) => ({ ...prev, [color]: true }));
    try {
      const urls = await Promise.all(
        files.map((f) => uploadProductImage(f, `${effectiveSlug}-${slugify(color)}`)),
      );
      setColorImages((prev) => ({
        ...prev,
        [color]: [...(prev[color] ?? []), ...urls],
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Failed to upload images for ${color}.`;
      setError(msg);
    } finally {
      setColorUploading((prev) => ({ ...prev, [color]: false }));
      e.target.value = "";
    }
  };

  const handleColorUrlAdd = (color: string) => {
    const url = (colorUrlInputs[color] ?? "").trim();
    if (!url) return;
    setColorImages((prev) => ({
      ...prev,
      [color]: [...(prev[color] ?? []), url],
    }));
    setColorUrlInputs((prev) => ({ ...prev, [color]: "" }));
  };

  const handleRemoveColorImage = (color: string, url: string) => {
    setColorImages((prev) => ({
      ...prev,
      [color]: (prev[color] ?? []).filter((u) => u !== url),
    }));
  };

  const handleSetPrimaryColorImage = (color: string, url: string) => {
    setColorImages((prev) => {
      const list = prev[color] ?? [];
      const filtered = list.filter((u) => u !== url);
      return { ...prev, [color]: [url, ...filtered] };
    });
  };

  const handleLengthImagesUpload = async (lengthVal: string, e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setLengthUploading((prev) => ({ ...prev, [lengthVal]: true }));
    try {
      const urls = await Promise.all(
        files.map((f) => uploadProductImage(f, `${effectiveSlug}-${slugify(lengthVal)}`)),
      );
      setLengthImages((prev) => ({
        ...prev,
        [lengthVal]: [...(prev[lengthVal] ?? []), ...urls],
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Failed to upload images for ${lengthVal}.`;
      setError(msg);
    } finally {
      setLengthUploading((prev) => ({ ...prev, [lengthVal]: false }));
      e.target.value = "";
    }
  };

  const handleLengthUrlAdd = (lengthVal: string) => {
    const url = (lengthUrlInputs[lengthVal] ?? "").trim();
    if (!url) return;
    setLengthImages((prev) => ({
      ...prev,
      [lengthVal]: [...(prev[lengthVal] ?? []), url],
    }));
    setLengthUrlInputs((prev) => ({ ...prev, [lengthVal]: "" }));
  };

  const handleRemoveLengthImage = (lengthVal: string, url: string) => {
    setLengthImages((prev) => ({
      ...prev,
      [lengthVal]: (prev[lengthVal] ?? []).filter((u) => u !== url),
    }));
  };  const handleSetPrimaryLengthImage = (lengthVal: string, url: string) => {
    setLengthImages((prev) => {
      const list = prev[lengthVal] ?? [];
      const filtered = list.filter((u) => u !== url);
      return { ...prev, [lengthVal]: [url, ...filtered] };
    });
  };

  const handleCombinedImagesUpload = async (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setCombinedUploading((prev) => ({ ...prev, [key]: true }));
    try {
      const urls = await Promise.all(files.map((f) => uploadProductImage(f, effectiveSlug)));
      setCombinedVariantImages((prev) => ({
        ...prev,
        [key]: [...(prev[key] ?? []), ...urls],
      }));
    } catch {
      setError("Failed to upload combined variant image.");
    } finally {
      setCombinedUploading((prev) => ({ ...prev, [key]: false }));
      e.target.value = "";
    }
  };

  const handleCombinedUrlAdd = (key: string) => {
    const url = (combinedUrlInputs[key] ?? "").trim();
    if (!url) return;
    setCombinedVariantImages((prev) => ({
      ...prev,
      [key]: [...(prev[key] ?? []), url],
    }));
    setCombinedUrlInputs((prev) => ({ ...prev, [key]: "" }));
  };

  const handleRemoveCombinedImage = (key: string, url: string) => {
    setCombinedVariantImages((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).filter((u) => u !== url),
    }));
  };

  const handleSetPrimaryCombinedImage = (key: string, url: string) => {
    setCombinedVariantImages((prev) => {
      const list = prev[key] ?? [];
      const filtered = list.filter((u) => u !== url);
      return { ...prev, [key]: [url, ...filtered] };
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
      if (!p || p <= 0) return setError("Enter a valid price.");
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
      lengths,
      inStock,
      onSale,
      featured,
      hasVariants,
      hasColorImages,
      ...(hasColorImages && Object.keys(colorImages).length ? { colorImages } : {}),
      hasLengthImages,
      ...(hasLengthImages && Object.keys(lengthImages).length ? { lengthImages } : {}),
      hasCombinedVariantImages,
      ...(hasCombinedVariantImages && Object.keys(combinedVariantImages).length ? { combinedVariantImages } : {}),
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(fabric.trim() ? { fabric: fabric.trim() } : {}),
      ...(careInstructions.trim() ? { careInstructions: careInstructions.trim() } : {}),
      ...(weightKg.trim() ? { weightKg: weightKg.trim() } : {}),
      ...(shippingWeightKg ? { shippingWeightKg: Number(shippingWeightKg) } : {}),
      ...(dimensions.trim() ? { dimensions: dimensions.trim() } : {}),
      ...(priceNote.trim() ? { priceNote: priceNote.trim() } : {}),
      ...(Object.keys(variantStock.sizes ?? {}).length || Object.keys(variantStock.colors ?? {}).length || Object.keys(variantStock.lengths ?? {}).length
        ? { variantStock }
        : {}),
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/65 p-4 backdrop-blur-md animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="my-8 w-full max-w-2xl rounded-card border border-mist bg-bone p-6 dark:border-edge dark:bg-ink shadow-2xl animate-modal-pop"
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
            <select value={category} onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)} className="input-field">
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
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SearchableColorSelector selected={colors} onToggle={(v) => setColors((c) => toggle(c, v))} />
          <PillGroup label="Lengths" options={PRODUCT_LENGTHS} selected={lengths} onToggle={(v) => setLengths((l) => toggle(l, v))} />
          <PillGroup label="Sizes" options={PRODUCT_SIZES} selected={sizes} onToggle={(v) => setSizes((s) => toggle(s, v))} />
          <PillGroup label="Tags" options={PRODUCT_TAGS} selected={tags} onToggle={(v) => setTags((t) => toggle(t, v))} />
        </div>

        {/* Flags */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-7">
          <CheckRow label="In stock" checked={inStock} onChange={setInStock} />
          <CheckRow label="On sale" checked={onSale} onChange={setOnSale} />
          <CheckRow label="Featured" checked={featured} onChange={setFeatured} />
          <CheckRow label="Has variants" checked={hasVariants} onChange={setHasVariants} />
          <CheckRow label="Color images" checked={hasColorImages} onChange={setHasColorImages} />
          <CheckRow label="Length images" checked={hasLengthImages} onChange={setHasLengthImages} />
          <CheckRow label="Combined images" checked={hasCombinedVariantImages} onChange={setHasCombinedVariantImages} />
        </div>

        {/* Color Variation Images Section */}
        {hasColorImages && (
          <div className="mt-4 rounded-card border border-gold/40 bg-gold/5 p-4 dark:border-gold/30 dark:bg-gold/10">
            <span className="block text-sm font-semibold text-gold">Color Variation Images</span>
            <p className="mt-1 text-xs text-ink/70 dark:text-bone/70">
              Upload or add image URLs corresponding to each color variation. When a customer selects a color, these images will reflect automatically.
            </p>

            {colors.length === 0 ? (
              <p className="mt-3 text-xs italic text-sale">
                Please select at least one color in the Colors group above to upload color-specific images.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {colors.map((color) => {
                  const imgs = colorImages[color] ?? [];
                  const isUploading = colorUploading[color] ?? false;
                  return (
                    <div key={color} className="rounded-card border border-mist bg-bone/80 p-3 dark:border-edge dark:bg-ink/80">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-bone flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full border border-mist dark:border-edge bg-gold inline-block"></span>
                          {color} Images
                        </span>
                        <span className="text-[11px] text-ink/50 dark:text-bone/50">
                          {imgs.length} image{imgs.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      {/* Image thumbnails for color */}
                      {imgs.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {imgs.map((url, idx) => (
                            <div key={url + idx} className="relative h-20 w-16 overflow-hidden rounded-card border border-mist dark:border-edge">
                              <img src={url} alt={`${color} ${idx}`} className="h-full w-full object-cover" />
                              {idx === 0 ? (
                                <span className="absolute bottom-0 left-0 right-0 bg-gold py-0.5 text-center text-[9px] font-semibold text-ink">
                                  Primary
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryColorImage(color, url)}
                                  className="absolute bottom-0 left-0 right-0 bg-ink/70 py-0.5 text-center text-[9px] text-bone hover:bg-ink"
                                >
                                  Set main
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveColorImage(color, url)}
                                className="absolute right-0 top-0 bg-ink/70 px-1 text-xs text-bone hover:bg-sale"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload & URL Controls */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <label className="btn-ghost cursor-pointer text-xs py-1 px-2.5">
                          {isUploading ? "Uploading…" : `+ Upload ${color} Image(s)`}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleColorImagesUpload(color, e)}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                        <div className="flex flex-1 items-center gap-1.5 min-w-[200px]">
                          <input
                            type="url"
                            value={colorUrlInputs[color] ?? ""}
                            onChange={(e) => setColorUrlInputs((prev) => ({ ...prev, [color]: e.target.value }))}
                            placeholder={`Or paste ${color} image URL`}
                            className="input-field py-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleColorUrlAdd(color)}
                            className="btn bg-gold px-2.5 py-1 text-xs font-medium text-ink hover:bg-[#fda437] hover:text-white shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Length Variation Images Section */}
        {hasLengthImages && (
          <div className="mt-4 rounded-card border border-gold/40 bg-gold/5 p-4 dark:border-gold/30 dark:bg-gold/10">
            <span className="block text-sm font-semibold text-gold">Length Variation Images</span>
            <p className="mt-1 text-xs text-ink/70 dark:text-bone/70">
              Upload or add image URLs corresponding to each length variation (e.g. Long, Short). When a customer selects a length, these images will reflect.
            </p>

            {lengths.length === 0 ? (
              <p className="mt-3 text-xs italic text-sale">
                Please select at least one length in the Lengths group above to upload length-specific images.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {lengths.map((len) => {
                  const imgs = lengthImages[len] ?? [];
                  const isUploading = lengthUploading[len] ?? false;
                  return (
                    <div key={len} className="rounded-card border border-mist bg-bone/80 p-3 dark:border-edge dark:bg-ink/80">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-bone flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full border border-mist dark:border-edge bg-gold inline-block"></span>
                          {len} Images
                        </span>
                        <span className="text-[11px] text-ink/50 dark:text-bone/50">
                          {imgs.length} image{imgs.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      {/* Image thumbnails for length */}
                      {imgs.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {imgs.map((url, idx) => (
                            <div key={url + idx} className="relative h-20 w-16 overflow-hidden rounded-card border border-mist dark:border-edge">
                              <img src={url} alt={`${len} ${idx}`} className="h-full w-full object-cover" />
                              {idx === 0 ? (
                                <span className="absolute bottom-0 left-0 right-0 bg-gold py-0.5 text-center text-[9px] font-semibold text-ink">
                                  Primary
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryLengthImage(len, url)}
                                  className="absolute bottom-0 left-0 right-0 bg-ink/70 py-0.5 text-center text-[9px] text-bone hover:bg-ink"
                                >
                                  Set main
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveLengthImage(len, url)}
                                className="absolute right-0 top-0 bg-ink/70 px-1 text-xs text-bone hover:bg-sale"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload & URL Controls */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <label className="btn-ghost cursor-pointer text-xs py-1 px-2.5">
                          {isUploading ? "Uploading…" : `+ Upload ${len} Image(s)`}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleLengthImagesUpload(len, e)}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                        <div className="flex flex-1 items-center gap-1.5 min-w-[200px]">
                          <input
                            type="url"
                            value={lengthUrlInputs[len] ?? ""}
                            onChange={(e) => setLengthUrlInputs((prev) => ({ ...prev, [len]: e.target.value }))}
                            placeholder={`Or paste ${len} image URL`}
                            className="input-field py-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleLengthUrlAdd(len)}
                            className="btn bg-gold px-2.5 py-1 text-xs font-medium text-ink hover:bg-[#fda437] hover:text-white shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Combined Variation Images Section */}
        {hasCombinedVariantImages && (
          <div className="mt-4 rounded-card border border-gold/40 bg-gold/5 p-4 dark:border-gold/30 dark:bg-gold/10">
            <span className="block text-sm font-semibold text-gold">Combined Variation Images (Color + Size / Length)</span>
            <p className="mt-1 text-xs text-ink/70 dark:text-bone/70">
              Link specific images to combined variations (e.g. Green + Small, Green + Short). When a customer selects both criteria on the product page, these specific combined images will reflect automatically.
            </p>

            {colors.length === 0 ? (
              <p className="mt-3 text-xs italic text-sale">
                Please select at least one color above to configure combined variation images.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {colors.map((c) => {
                  const subOptions = sizes.length > 0 ? sizes : (lengths.length > 0 ? lengths : ["Default"]);
                  return subOptions.map((s) => {
                    const key = `${c}_${s}`;
                    const label = `${c} + ${s}`;
                    const imgs = combinedVariantImages[key] ?? [];
                    const isUploading = combinedUploading[key] ?? false;

                    return (
                      <div key={key} className="rounded-card border border-mist bg-bone/80 p-3 dark:border-edge dark:bg-ink/80">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-bone flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full border border-mist dark:border-edge bg-gold inline-block"></span>
                            {label} Images
                          </span>
                          <span className="text-[11px] text-ink/50 dark:text-bone/50">
                            {imgs.length} image{imgs.length === 1 ? "" : "s"}
                          </span>
                        </div>

                        {/* Thumbnails */}
                        {imgs.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {imgs.map((url, idx) => (
                              <div key={url + idx} className="relative h-20 w-16 overflow-hidden rounded-card border border-mist dark:border-edge">
                                <img src={url} alt={`${label} ${idx}`} className="h-full w-full object-cover" />
                                {idx === 0 ? (
                                  <span className="absolute bottom-0 left-0 right-0 bg-gold py-0.5 text-center text-[9px] font-semibold text-ink">
                                    Primary
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryCombinedImage(key, url)}
                                    className="absolute bottom-0 left-0 right-0 bg-ink/70 py-0.5 text-center text-[9px] text-bone hover:bg-ink"
                                  >
                                    Set main
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCombinedImage(key, url)}
                                  className="absolute right-0 top-0 bg-ink/70 px-1 text-xs text-bone hover:bg-sale"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Upload & URL Controls */}
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          <label className="btn-ghost cursor-pointer text-xs py-1 px-2.5">
                            {isUploading ? "Uploading…" : `+ Upload ${label} Image(s)`}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleCombinedImagesUpload(key, e)}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </label>
                          <div className="flex flex-1 items-center gap-1.5 min-w-[200px]">
                            <input
                              type="url"
                              value={combinedUrlInputs[key] ?? ""}
                              onChange={(e) => setCombinedUrlInputs((prev) => ({ ...prev, [key]: e.target.value }))}
                              placeholder={`Or paste ${label} image URL`}
                              className="input-field py-1 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleCombinedUrlAdd(key)}
                              className="btn bg-gold px-2.5 py-1 text-xs font-medium text-ink hover:bg-[#fda437] hover:text-white shrink-0"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            )}
          </div>
        )}

        {/* Variant Stock Control */}
        {(sizes.length > 0 || colors.length > 0 || lengths.length > 0) && (
          <div className="mt-4 rounded-card border border-mist p-4 dark:border-edge">
            <span className="block text-sm font-semibold">Variant Stock Control</span>
            {sizes.length > 0 && (
              <div className="mt-3">
                <span className="mb-1 block text-xs font-semibold text-ink/70 dark:text-bone/70">Sizes</span>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => {
                    const inStockVal = variantStock.sizes?.[size] ?? true;
                    return (
                      <label key={size} className="flex items-center gap-1.5 text-sm">
                        <input
                          type="checkbox"
                          checked={inStockVal}
                          onChange={() => {
                            setVariantStock((prev) => ({
                              ...prev,
                              sizes: { ...prev.sizes, [size]: !(prev.sizes?.[size] ?? true) },
                            }));
                          }}
                          className="h-4 w-4 accent-gold"
                        />
                        <span className="text-xs">{size}</span>
                        {!inStockVal && (
                          <span className="text-[10px] font-semibold text-sale">Out of stock</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            {colors.length > 0 && (
              <div className="mt-3">
                <span className="mb-1 block text-xs font-semibold text-ink/70 dark:text-bone/70">Colors</span>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => {
                    const inStockVal = variantStock.colors?.[color] ?? true;
                    return (
                      <label key={color} className="flex items-center gap-1.5 text-sm">
                        <input
                          type="checkbox"
                          checked={inStockVal}
                          onChange={() => {
                            setVariantStock((prev) => ({
                              ...prev,
                              colors: { ...prev.colors, [color]: !(prev.colors?.[color] ?? true) },
                            }));
                          }}
                          className="h-4 w-4 accent-gold"
                        />
                        <span className="text-xs">{color}</span>
                        {!inStockVal && (
                          <span className="text-[10px] font-semibold text-sale">Out of stock</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            {lengths.length > 0 && (
              <div className="mt-3">
                <span className="mb-1 block text-xs font-semibold text-ink/70 dark:text-bone/70">Lengths</span>
                <div className="flex flex-wrap gap-3">
                  {lengths.map((len) => {
                    const inStockVal = variantStock.lengths?.[len] ?? true;
                    return (
                      <label key={len} className="flex items-center gap-1.5 text-sm">
                        <input
                          type="checkbox"
                          checked={inStockVal}
                          onChange={() => {
                            setVariantStock((prev) => ({
                              ...prev,
                              lengths: { ...prev.lengths, [len]: !(prev.lengths?.[len] ?? true) },
                            }));
                          }}
                          className="h-4 w-4 accent-gold"
                        />
                        <span className="text-xs">{len}</span>
                        {!inStockVal && (
                          <span className="text-[10px] font-semibold text-sale">Out of stock</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

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

function SearchableColorSelector({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (color: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = PRODUCT_COLORS.filter((c) =>
    c.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const isExactMatch = PRODUCT_COLORS.some(
    (c) => c.toLowerCase() === query.trim().toLowerCase(),
  );

  const canAddCustom = query.trim() && !isExactMatch;

  return (
    <div className="relative">
      <span className="mb-1 block text-sm font-semibold">Colors</span>

      {/* Selected Color Pills */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {selected.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1.5 rounded-card border border-gold bg-gold/15 px-2 py-0.5 text-xs font-semibold text-ink dark:text-bone"
          >
            <span className="h-2 w-2 rounded-full bg-gold border border-mist inline-block"></span>
            {c}
            <button
              type="button"
              onClick={() => onToggle(c)}
              className="text-ink/60 hover:text-sale dark:text-bone/60 dark:hover:text-sale ml-0.5 text-xs font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search color (e.g. Red, Emerald)..."
          className="input-field py-1 text-xs w-full"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink/40 hover:text-ink dark:text-bone/40 dark:hover:text-bone"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto rounded-card border border-mist bg-bone shadow-xl dark:border-edge dark:bg-ink p-1">
          {canAddCustom && (
            <button
              type="button"
              onClick={() => {
                const custom = query.trim();
                if (!selected.includes(custom)) {
                  onToggle(custom);
                }
                setQuery("");
                setIsOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10 rounded flex items-center gap-1.5"
            >
              <span>+ Add custom color "{query.trim()}"</span>
            </button>
          )}

          {filtered.length > 0 ? (
            filtered.map((color) => {
              const isSelected = selected.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    onToggle(color);
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-gold/20 font-semibold text-ink dark:text-bone"
                      : "hover:bg-mist/50 dark:hover:bg-edge/50 text-ink/80 dark:text-bone/80"
                  }`}
                >
                  <span>{color}</span>
                  {isSelected && <span className="text-[10px] text-gold font-bold">Selected</span>}
                </button>
              );
            })
          ) : !canAddCustom ? (
            <div className="px-2.5 py-2 text-xs text-ink/50 dark:text-bone/50 italic">
              No matching colors found.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
