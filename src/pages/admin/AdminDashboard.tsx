import { useEffect, useMemo, useState } from "react";
import type { Product, Order, OrderStatus } from "@/types";
import { useProductStore } from "@/store/useProductStore";
import { useToastStore } from "@/store/useToastStore";
import { formatPrice, formatProductPrice } from "@/lib/format";
import {
  createOrUpdateProduct,
  deleteProduct,
  seedProductsIfEmpty,
  importProductsToDb,
} from "@/lib/products-db";
import { subscribeToOrders, updateOrderStatus } from "@/lib/orders-db";
import { ProductForm } from "./ProductForm";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-gold/20 text-ink dark:text-bone",
  paid: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  failed: "bg-sale/15 text-sale",
};

export function AdminDashboard() {
  const products = useProductStore((s) => s.products);
  const usingFallback = useProductStore((s) => s.usingFallback);
  const addToast = useToastStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Live orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Subscribe to live orders
  useEffect(() => {
    return subscribeToOrders(
      (list) => {
        setOrders(list);
        setOrdersLoaded(true);
      },
      (err) => {
        console.error("Failed to fetch live orders:", err);
        addToast("Failed to load orders");
        setOrdersLoaded(true);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const existingIds = useMemo(() => products.map((p) => p.id), [products]);

  // Analytics derivations
  const analytics = useMemo(() => {
    const paidOrders = orders.filter((o) => o.status === "paid");
    const pendingOrders = orders.filter((o) => o.status === "pending");

    const totalSales = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingBank = pendingOrders
      .filter((o) => o.paymentMethod === "bank")
      .reduce((sum, o) => sum + o.total, 0);
    const aov = paidOrders.length ? totalSales / paidOrders.length : 0;

    const deliveryCount = orders.filter((o) => o.fulfillment === "delivery").length;
    const pickupCount = orders.filter((o) => o.fulfillment === "pickup").length;

    return {
      totalSales,
      pendingBank,
      totalOrders: orders.length,
      paidCount: paidOrders.length,
      pendingCount: pendingOrders.length,
      failedCount: orders.filter((o) => o.status === "failed").length,
      aov,
      deliveryCount,
      pickupCount,
    };
  }, [orders]);

  // Product filtering
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    );
  }, [products, query]);

  // Order filtering
  const filteredOrders = useMemo(() => {
    let list = orders;
    
    // Status filter
    if (orderStatusFilter !== "all") {
      list = list.filter((o) => o.status === orderStatusFilter);
    }

    // Text search
    const q = orderQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.reference.toLowerCase().includes(q) ||
          `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, orderStatusFilter, orderQuery]);

  const toggleStock = async (product: Product) => {
    setBusyId(product.id);
    try {
      await createOrUpdateProduct({ ...product, inStock: !product.inStock });
      addToast(product.inStock ? "Marked out of stock" : "Marked in stock");
    } catch {
      addToast("Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setBusyId(product.id);
    try {
      await deleteProduct(product.id);
      addToast("Product deleted");
    } catch {
      addToast("Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const count = await seedProductsIfEmpty();
      addToast(count > 0 ? `Imported ${count} products` : "Catalog already imported");
    } catch {
      addToast("Import failed — check permissions");
    } finally {
      setSeeding(false);
    }
  };

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "potters-design-products.json";
      link.click();
      URL.revokeObjectURL(url);
      addToast("Catalog exported successfully");
    } catch (err) {
      console.error(err);
      addToast("Export failed");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== "string") {
          throw new Error("Could not read file content");
        }

        const imported = JSON.parse(text);
        if (!Array.isArray(imported)) {
          throw new Error("Imported data must be an array of products");
        }

        for (const item of imported) {
          if (
            typeof item !== "object" ||
            item === null ||
            typeof item.id !== "number" ||
            !item.name ||
            !item.slug ||
            item.price === undefined ||
            !item.category ||
            !item.image
          ) {
            throw new Error(`Invalid product data structure for item ID: ${item?.id ?? "unknown"}`);
          }
        }

        const ids = imported.map((p) => p.id);
        const uniqueIds = new Set(ids);
        if (uniqueIds.size !== ids.length) {
          throw new Error("Imported data contains duplicate product IDs");
        }

        const confirmMsg = `Are you sure you want to import ${imported.length} products? This will add new products and overwrite existing products with matching IDs.`;
        if (!window.confirm(confirmMsg)) {
          e.target.value = "";
          return;
        }

        setSeeding(true);
        await importProductsToDb(imported);
        addToast(`Successfully imported ${imported.length} products`);
      } catch (err) {
        console.error(err);
        const msg = err instanceof Error ? err.message : "Invalid JSON file structure";
        alert(`Import failed: ${msg}`);
      } finally {
        setSeeding(false);
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleStatusUpdate = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, nextStatus);
      addToast("Order status updated");
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((o) => (o ? { ...o, status: nextStatus } : null));
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to update status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="shell py-8">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Store Dashboard</h1>
          <p className="text-sm text-ink/60 dark:text-bone/60">Manage your shop, check logs & track metrics.</p>
        </div>

        {activeTab === "products" && (
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={handleExport} className="btn-ghost py-2 text-xs">
              Export JSON
            </button>
            <label className="btn-ghost py-2 text-xs cursor-pointer">
              Import JSON
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button type="button" onClick={() => setCreating(true)} className="btn-primary py-2 text-xs">
              + Add product
            </button>
          </div>
        )}
      </div>

      {/* Seeding Alert for Products */}
      {usingFallback && activeTab === "products" && (
        <div className="mt-6 rounded-card border border-gold/50 bg-gold/10 p-4 text-sm">
          <p className="font-semibold">This catalog isn&apos;t saved to the database yet.</p>
          <p className="mt-1 text-ink/70 dark:text-bone/70">
            You&apos;re seeing the built-in product list. Import it once to start managing products live.
          </p>
          <button type="button" onClick={handleSeed} disabled={seeding} className="btn-accent mt-3 disabled:opacity-60">
            {seeding ? "Importing…" : "Import current catalog"}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-8 flex gap-1 border-b border-mist/70 dark:border-edge/70">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-5 py-3 font-display text-sm font-semibold transition-colors -mb-[2px] ${
              activeTab === tab.id
                ? "border-gold text-gold"
                : "border-transparent text-ink/55 hover:text-ink dark:text-bone/55 dark:hover:text-bone"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: OVERVIEW ──────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="mt-8 space-y-8">
          {/* Analytics Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Sales Revenue */}
            <div className="rounded-card border border-mist bg-bone p-5 dark:border-edge dark:bg-carbon">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/40 dark:text-bone/45">Paid Revenue</span>
              <p className="font-display text-2xl font-bold text-gold mt-2">{formatPrice(analytics.totalSales)}</p>
              <div className="mt-2 text-xs text-ink/50 dark:text-bone/50">{analytics.paidCount} paid orders</div>
            </div>

            {/* Pending Transfer */}
            <div className="rounded-card border border-mist bg-bone p-5 dark:border-edge dark:bg-carbon">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/40 dark:text-bone/45">Pending Bank Transfer</span>
              <p className="font-display text-2xl font-bold mt-2 text-ink/80 dark:text-bone/80">{formatPrice(analytics.pendingBank)}</p>
              <div className="mt-2 text-xs text-ink/50 dark:text-bone/50">{analytics.pendingCount} pending orders</div>
            </div>

            {/* Total Volume */}
            <div className="rounded-card border border-mist bg-bone p-5 dark:border-edge dark:bg-carbon">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/40 dark:text-bone/45">Order Volume</span>
              <p className="font-display text-2xl font-bold mt-2 text-ink dark:text-bone">{analytics.totalOrders}</p>
              <div className="mt-2 text-xs text-ink/50 dark:text-bone/50">
                {analytics.deliveryCount} delivery · {analytics.pickupCount} pickup
              </div>
            </div>

            {/* AOV */}
            <div className="rounded-card border border-mist bg-bone p-5 dark:border-edge dark:bg-carbon">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/40 dark:text-bone/45">Average Order Value (AOV)</span>
              <p className="font-display text-2xl font-bold text-gold mt-2">{formatPrice(analytics.aov)}</p>
              <div className="mt-2 text-xs text-ink/50 dark:text-bone/50">calculated from paid orders</div>
            </div>
          </div>

          {/* Details & Logs */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Recent Orders List */}
            <div className="rounded-card border border-mist bg-bone p-6 dark:border-edge dark:bg-carbon">
              <h2 className="font-display text-base font-semibold">Recent Orders</h2>
              <p className="text-xs text-ink/50 dark:text-bone/45 mt-1">Check recent checkout logs.</p>
              <div className="mt-4 divide-y divide-mist/50 dark:divide-edge/50">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-semibold text-ink dark:text-bone">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-xs text-ink/50 dark:text-bone/45 mt-0.5">
                        {order.id} · {order.createdAt.toLocaleDateString("en-NG", { dateStyle: "short" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs font-semibold">{formatPrice(order.total)}</p>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold mt-1 uppercase ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-sm text-ink/50 dark:text-bone/50 py-8">No orders logged yet.</p>
                )}
              </div>
            </div>

            {/* Store Status Summary */}
            <div className="rounded-card border border-mist bg-bone p-6 dark:border-edge dark:bg-carbon">
              <h2 className="font-display text-base font-semibold">Store Stats</h2>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <span className="text-xs font-semibold text-ink/40 dark:text-bone/40 uppercase">Fulfilment Distribution</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Delivery</span>
                    <span className="font-mono font-semibold">{analytics.deliveryCount}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span>Store Pickup</span>
                    <span className="font-mono font-semibold">{analytics.pickupCount}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-ink/40 dark:text-bone/40 uppercase">Status Breakdown</span>
                  <div className="mt-2 flex items-center justify-between text-emerald-600 dark:text-emerald-450">
                    <span>Paid</span>
                    <span className="font-mono font-semibold">{analytics.paidCount}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-gold">
                    <span>Pending Bank Transfer</span>
                    <span className="font-mono font-semibold">{analytics.pendingCount}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sale">
                    <span>Failed / Cancelled</span>
                    <span className="font-mono font-semibold">{analytics.failedCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PRODUCTS ──────────────────────────────────────────────── */}
      {activeTab === "products" && (
        <div className="mt-8 space-y-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or category…"
            className="input-field max-w-sm"
          />

          <div className="overflow-x-auto rounded-card border border-mist dark:border-edge">
            <table className="w-full text-sm">
              <thead className="border-b border-mist bg-surface text-left text-xs uppercase tracking-wider text-ink/60 dark:border-edge dark:bg-carbon dark:text-bone/60">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-mist/60 last:border-0 dark:border-edge/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt="" className="h-12 w-10 rounded-card object-cover" />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-xs text-ink/50 dark:text-bone/50">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3 font-mono text-xs">{formatProductPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void toggleStock(product)}
                        disabled={busyId === product.id}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.inStock ? "bg-gold/20 text-ink dark:text-bone" : "bg-sale/15 text-sale"
                        } disabled:opacity-50`}
                      >
                        {product.inStock ? "In stock" : "Out of stock"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setEditing(product)} className="font-semibold text-ink hover:text-gold dark:text-bone">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(product)}
                          disabled={busyId === product.id}
                          className="font-semibold text-sale hover:underline disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-ink/50 dark:text-bone/50">
                      No products match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: ORDERS ───────────────────────────────────────────────── */}
      {activeTab === "orders" && (
        <div className="mt-8 space-y-4">
          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <input
              type="search"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Search by ID, name, email..."
              className="input-field max-w-sm"
            />

            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink/65 dark:text-bone/65">Status</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="rounded-card border border-mist bg-bone px-3 py-2 text-sm focus:border-gold focus:outline-none dark:border-edge dark:bg-carbon dark:text-bone"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-card border border-mist dark:border-edge">
            <table className="w-full text-sm">
              <thead className="border-b border-mist bg-surface text-left text-xs uppercase tracking-wider text-ink/60 dark:border-edge dark:bg-carbon dark:text-bone/60">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Method</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-mist/60 last:border-0 dark:border-edge/60">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{order.id}</td>
                    <td className="px-4 py-3 text-xs">
                      {order.createdAt.toLocaleDateString("en-NG", {
                        dateStyle: "medium",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <p className="text-xs text-ink/50 dark:text-bone/50">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 uppercase text-xs font-semibold text-ink/70 dark:text-bone/70">
                      {order.paymentMethod} · {order.fulfillment}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="font-semibold text-gold hover:underline"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-ink/50 dark:text-bone/50">
                      {!ordersLoaded ? (
                        "Loading orders..."
                      ) : orders.length === 0 ? (
                        "No orders"
                      ) : (
                        "No orders match your search."
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: PRODUCT EDIT/ADD FORM ─────────────────────────────────── */}
      {(creating || editing) && (
        <ProductForm
          initial={editing}
          existingIds={existingIds}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={(message) => {
            addToast(message);
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      {/* ── MODAL: ORDER DETAILS DRAWER ─────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/65 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-3xl rounded-card border border-mist bg-bone p-6 dark:border-edge dark:bg-ink">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-mist/50 pb-4 dark:border-edge/50">
              <div>
                <span className="text-xs uppercase tracking-wider text-ink/40 dark:text-bone/45 font-semibold">
                  Order Details
                </span>
                <h2 className="font-display text-xl font-semibold mt-1">
                  Reference: <span className="font-mono">{selectedOrder.id}</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-2xl leading-none text-ink/50 hover:text-ink dark:text-bone/50 dark:hover:text-bone"
              >
                ×
              </button>
            </div>

            {/* Info Grid */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Left Column: Customer & Delivery Info */}
              <div className="space-y-6">
                {/* Customer Section */}
                <div className="rounded-card border border-mist/60 bg-surface/30 p-4 dark:border-edge/60 dark:bg-carbon/20">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">Customer Contact</h3>
                  <div className="mt-3 space-y-1.5 text-sm">
                    <p>
                      <strong className="text-ink/60 dark:text-bone/60">Name:</strong> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                    </p>
                    <p>
                      <strong className="text-ink/60 dark:text-bone/60">Email:</strong> {selectedOrder.customer.email}
                    </p>
                    <p>
                      <strong className="text-ink/60 dark:text-bone/60">Phone:</strong> {selectedOrder.customer.phone}
                    </p>
                  </div>
                </div>

                {/* Shipping Section */}
                <div className="rounded-card border border-mist/60 bg-surface/30 p-4 dark:border-edge/60 dark:bg-carbon/20">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">Fulfillment Details</h3>
                  <div className="mt-3 space-y-1.5 text-sm">
                    <p>
                      <strong className="text-ink/60 dark:text-bone/60">Method:</strong> <span className="capitalize">{selectedOrder.fulfillment}</span>
                    </p>
                    {selectedOrder.fulfillment === "delivery" && selectedOrder.shippingAddress ? (
                      <div className="mt-2 pt-2 border-t border-mist/40 dark:border-edge/40 space-y-1 text-xs">
                        <p>{selectedOrder.shippingAddress.address}</p>
                        <p>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                        </p>
                        <p>
                          {selectedOrder.shippingAddress.zip} · {selectedOrder.shippingAddress.countryCode}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-ink/50 dark:text-bone/50">Store Pickup · Obanikoro Lagos</p>
                    )}
                  </div>
                </div>

                {/* Customer Note */}
                {selectedOrder.orderNote && (
                  <div className="rounded-card border border-mist/60 bg-surface/30 p-4 dark:border-edge/60 dark:bg-carbon/20">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">Customer Note</h3>
                    <p className="mt-2 text-sm italic text-ink/80 dark:text-bone/80">&ldquo;{selectedOrder.orderNote}&rdquo;</p>
                  </div>
                )}
              </div>

              {/* Right Column: Order Items & Payment Edit */}
              <div className="space-y-6">
                {/* Items List */}
                <div className="rounded-card border border-mist/60 bg-surface/30 p-4 dark:border-edge/60 dark:bg-carbon/20">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Order Items</h3>
                  <div className="divide-y divide-mist/40 dark:divide-edge/40 max-h-48 overflow-y-auto pr-1">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 py-2.5 text-sm first:pt-0 last:pb-0">
                        <img src={item.image} alt="" className="h-10 w-8 rounded-card object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{item.name}</p>
                          <p className="text-xs text-ink/50 dark:text-bone/50 mt-0.5">
                            {item.size && `Size: ${item.size}`} {item.color && `· Color: ${item.color}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-xs font-semibold">{formatPrice(item.unitPrice * item.quantity)}</p>
                          <p className="text-xs text-ink/50 dark:text-bone/50 mt-0.5">
                            {formatPrice(item.unitPrice)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals */}
                  <div className="mt-4 pt-3 border-t border-mist/50 dark:border-edge/50 space-y-1.5 text-xs text-ink/75 dark:text-bone/75">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono">{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span className="font-mono">
                        {selectedOrder.shippingFee === 0 ? "Free (pickup)" : formatPrice(selectedOrder.shippingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-ink dark:text-bone pt-1.5 border-t border-mist/30 dark:border-edge/30">
                      <span>Grand Total</span>
                      <span className="font-mono text-gold">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Payment Status Section */}
                <div className="rounded-card border border-mist/60 bg-surface/30 p-4 dark:border-edge/60 dark:bg-carbon/20">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">Update Payment Status</h3>
                  <p className="mt-1 text-xs text-ink/55 dark:text-bone/55">
                    Method: <span className="uppercase font-semibold">{selectedOrder.paymentMethod}</span>
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <select
                      value={selectedOrder.status}
                      disabled={updatingOrderId === selectedOrder.id}
                      onChange={(e) => void handleStatusUpdate(selectedOrder.id, e.target.value as OrderStatus)}
                      className="flex-1 rounded-card border border-mist bg-bone px-3 py-2 text-sm focus:border-gold focus:outline-none dark:border-edge dark:bg-carbon dark:text-bone disabled:opacity-60"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed / Cancelled</option>
                    </select>
                    {updatingOrderId === selectedOrder.id && (
                      <span className="text-xs text-ink/40 dark:text-bone/45">Updating...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex justify-end border-t border-mist/50 pt-4 dark:border-edge/50">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="btn-primary py-2 px-5 text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
