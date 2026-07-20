import { useEffect, useMemo, useState, useCallback } from "react";
import type { Product, Order, OrderStatus, OrderProductionStatus } from "@/types";
import { useProductStore } from "@/store/useProductStore";
import { useToastStore } from "@/store/useToastStore";
import { formatPrice, formatProductPrice } from "@/lib/format";
import {
  createOrUpdateProduct,
  deleteProduct,
  seedProductsIfEmpty,
  importProductsToDb,
} from "@/lib/products-db";
import { subscribeToOrders, updateOrderStatus, updateOrderProductionStatus } from "@/lib/orders-db";
import { ProductForm } from "./ProductForm";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "pipeline", label: "Pipeline" },
  { id: "logistics", label: "Logistics" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PRODUCTION_STEPS: { key: OrderProductionStatus; label: string; icon: string; color: string }[] = [
  { key: "received", label: "Received", icon: "📥", color: "border-blue-400 bg-blue-50 dark:bg-blue-950/30" },
  { key: "production", label: "Cutting & Sewing", icon: "🧵", color: "border-amber-400 bg-amber-50 dark:bg-amber-950/30" },
  { key: "ready", label: "Ready for Dispatch", icon: "📦", color: "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" },
  { key: "completed", label: "Completed", icon: "✅", color: "border-green-400 bg-green-50 dark:bg-green-950/30" },
];

const LAGOS_ZONES: { name: string; areas: string[] }[] = [
  { name: "Lagos Mainland", areas: ["Yaba","Surulere","Ebute Metta","Mushin","Somolu","Bariga","Gbagada","Maryland","Anthony","Ilupeju","Oshodi","Isolo","Palmgrove","Fadeyi","Ojota","Ketu","Alapere","Ogudu","Magodo","Ikeja","Allen","Opebi","GRA Ikeja","Agege","Ogba","Iju","Abule Egba","Ipaja","Gowon Estate","Egbeda","Ayobo","Iyana Ipaja","Alimosho","Festac","Amuwo Odofin","Iganmu","Apapa","Orile","Coker","Satellite Town","Kirikiri","Mile 2","Badagry"] },
  { name: "Lagos Island", areas: ["Victoria Island","Ikoyi","Banana Island","Lekki Phase 1","Ikate","Oniru","Chevron Drive","Orchid Road","VGC","Ikota","Osapa London","Jakande","Marina","Lagos Island","Falomo","Eko Atlantic"] },
  { name: "Ajah Corridor", areas: ["Ajah","Abraham Adesanya","Ogombo","Sangotedo","Abijo","Lakowe","Ibeju-Lekki","Eleko","Epe"] },
  { name: "Ogun Border Axis", areas: ["Berger","Ojodu","Isheri","Magboro","Mowe","Ibafo","Arepo","Alagbole","Akute","Opic","Sango Ota","Ado-Odo"] },
];

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

  // Pipeline state
  const [updatingProductionId, setUpdatingProductionId] = useState<string | null>(null);

  // Logistics state
  const [logisticsZoneFilter, setLogisticsZoneFilter] = useState<string>("all");
  const [logisticsFulfillmentFilter, setLogisticsFulfillmentFilter] = useState<string>("all");

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

    // Top selling products by quantity
    const productQtyMap = new Map<string, { name: string; qty: number; revenue: number; image: string }>();
    for (const o of paidOrders) {
      for (const item of o.items) {
        const existing = productQtyMap.get(item.name) ?? { name: item.name, qty: 0, revenue: 0, image: item.image };
        existing.qty += item.quantity;
        existing.revenue += item.unitPrice * item.quantity;
        productQtyMap.set(item.name, existing);
      }
    }
    const topProducts = [...productQtyMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Weekly sales for the last 8 weeks
    const now = Date.now();
    const weeklySales: { label: string; total: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now - i * 7 * 86400000);
      const weekEnd = new Date(now - (i - 1) * 7 * 86400000);
      const weekLabel = weekStart.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
      const weekTotal = paidOrders
        .filter((o) => o.createdAt >= weekStart && o.createdAt < weekEnd)
        .reduce((sum, o) => sum + o.total, 0);
      weeklySales.push({ label: weekLabel, total: weekTotal });
    }

    // Zone distribution for delivery orders
    const zoneDistribution = new Map<string, number>();
    for (const o of orders.filter((o) => o.fulfillment === "delivery")) {
      const state = o.shippingAddress?.state ?? "Unknown";
      const zoneMatch = state.match(/\((.+?)\)/);
      const zone = zoneMatch ? zoneMatch[1] : "Other";
      zoneDistribution.set(zone, (zoneDistribution.get(zone) ?? 0) + 1);
    }

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
      topProducts,
      weeklySales,
      zoneDistribution: [...zoneDistribution.entries()].sort((a, b) => b[1] - a[1]),
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

  const handleProductionStatusUpdate = async (orderId: string, nextStatus: OrderProductionStatus) => {
    setUpdatingProductionId(orderId);
    try {
      await updateOrderProductionStatus(orderId, nextStatus);
      addToast(`Production status → ${nextStatus}`);
    } catch (err) {
      console.error(err);
      addToast("Failed to update production status");
    } finally {
      setUpdatingProductionId(null);
    }
  };

  // Pipeline computed data
  const pipelineOrders = useMemo(() => {
    return orders.filter((o) => o.status === "paid");
  }, [orders]);

  const tailoringSheet = useMemo(() => {
    const sheet = new Map<string, { name: string; size: string; length: string; qty: number }>();
    for (const o of pipelineOrders) {
      const ps = o.productionStatus ?? "pending";
      if (ps === "completed") continue;
      for (const item of o.items) {
        const key = `${item.name}|${item.size ?? "—"}|${item.length ?? "—"}`;
        const existing = sheet.get(key) ?? { name: item.name, size: item.size ?? "—", length: item.length ?? "—", qty: 0 };
        existing.qty += item.quantity;
        sheet.set(key, existing);
      }
    }
    return [...sheet.values()].sort((a, b) => b.qty - a.qty);
  }, [pipelineOrders]);

  // Logistics computed data
  const logisticsOrders = useMemo(() => {
    let list = orders.filter((o) => o.status === "paid" || o.status === "pending");

    if (logisticsFulfillmentFilter !== "all") {
      list = list.filter((o) => o.fulfillment === logisticsFulfillmentFilter);
    }

    if (logisticsZoneFilter !== "all") {
      list = list.filter((o) => {
        const state = o.shippingAddress?.state ?? "";
        return state.includes(`(${logisticsZoneFilter})`);
      });
    }

    return list;
  }, [orders, logisticsFulfillmentFilter, logisticsZoneFilter]);

  const handleCsvExport = useCallback(() => {
    const rows = logisticsOrders
      .filter((o) => o.fulfillment === "delivery")
      .map((o) => ({
        "Order ID": o.id,
        "Customer": `${o.customer.firstName} ${o.customer.lastName}`,
        "Phone": o.customer.phone,
        "Email": o.customer.email,
        "Address": o.shippingAddress?.address ?? "",
        "City": o.shippingAddress?.city ?? "",
        "State": o.shippingAddress?.state ?? "",
        "Items": o.items.map((i) => `${i.name} x${i.quantity}${i.size ? ` (${i.size})` : ""}`).join("; "),
        "Total": o.total,
        "Status": o.status,
      }));

    if (!rows.length) {
      addToast("No delivery orders to export");
      return;
    }

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers.map((h) => {
          const val = String(r[h as keyof typeof r]);
          return val.includes(",") || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `potters-dispatch-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast("Dispatch CSV downloaded");
  }, [logisticsOrders, addToast]);

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
            <div className="space-y-6">
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

              {/* Zone Distribution */}
              {analytics.zoneDistribution.length > 0 && (
                <div className="rounded-card border border-mist bg-bone p-6 dark:border-edge dark:bg-carbon">
                  <h2 className="font-display text-base font-semibold">Delivery Zones</h2>
                  <div className="mt-4 space-y-2 text-sm">
                    {analytics.zoneDistribution.map(([zone, count]) => (
                      <div key={zone} className="flex items-center justify-between">
                        <span className="text-ink/70 dark:text-bone/70">{zone}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 rounded-full bg-gold/30" style={{ width: `${Math.max(20, (count / Math.max(...analytics.zoneDistribution.map((z) => z[1]))) * 80)}px` }}>
                            <div className="h-full rounded-full bg-gold" style={{ width: "100%" }} />
                          </div>
                          <span className="font-mono font-semibold text-xs w-6 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sales Trend Chart + Top Products */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Weekly Sales Chart */}
            <div className="rounded-card border border-mist bg-bone p-6 dark:border-edge dark:bg-carbon">
              <h2 className="font-display text-base font-semibold">Sales Trend</h2>
              <p className="text-xs text-ink/50 dark:text-bone/45 mt-1">Weekly revenue (last 8 weeks)</p>
              <div className="mt-4">
                {(() => {
                  const maxVal = Math.max(...analytics.weeklySales.map((w) => w.total), 1);
                  const chartH = 140;
                  const barW = 100 / analytics.weeklySales.length;
                  return (
                    <div>
                      <svg viewBox={`0 0 400 ${chartH + 30}`} className="w-full" aria-label="Weekly sales chart">
                        {analytics.weeklySales.map((w, i) => {
                          const barH = (w.total / maxVal) * chartH;
                          const x = i * (400 / analytics.weeklySales.length) + 10;
                          const barWidth = 400 / analytics.weeklySales.length - 20;
                          return (
                            <g key={i}>
                              <rect
                                x={x}
                                y={chartH - barH}
                                width={Math.max(barWidth, 8)}
                                height={barH}
                                rx={4}
                                className="fill-gold/70 transition-all hover:fill-gold"
                              />
                              <text
                                x={x + barWidth / 2}
                                y={chartH + 16}
                                textAnchor="middle"
                                className="fill-ink/40 dark:fill-bone/40 text-[9px]"
                              >
                                {w.label}
                              </text>
                              {w.total > 0 && (
                                <text
                                  x={x + barWidth / 2}
                                  y={chartH - barH - 6}
                                  textAnchor="middle"
                                  className="fill-ink/60 dark:fill-bone/60 text-[8px] font-semibold"
                                >
                                  {formatPrice(w.total)}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Top Products Leaderboard */}
            <div className="rounded-card border border-mist bg-bone p-6 dark:border-edge dark:bg-carbon">
              <h2 className="font-display text-base font-semibold">Best Sellers</h2>
              <p className="text-xs text-ink/50 dark:text-bone/45 mt-1">Top products by revenue</p>
              <div className="mt-4 divide-y divide-mist/50 dark:divide-edge/50">
                {analytics.topProducts.length > 0 ? (
                  analytics.topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3 py-3 text-sm first:pt-0 last:pb-0">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">
                        {i + 1}
                      </span>
                      <img
                        src={p.image || "/hanger-placeholder.svg"}
                        alt=""
                        onError={(e) => { (e.target as HTMLImageElement).src = "/hanger-placeholder.svg"; }}
                        className="h-9 w-7 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{p.name}</p>
                        <p className="text-xs text-ink/50 dark:text-bone/50">{p.qty} sold</p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-gold">{formatPrice(p.revenue)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-ink/50 dark:text-bone/50 py-8">No sales data yet.</p>
                )}
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
                        <img
                          src={product.image || "/hanger-placeholder.svg"}
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/hanger-placeholder.svg";
                          }}
                          className="h-12 w-10 rounded-card object-cover"
                        />
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

      {/* ── TAB 4: PIPELINE ─────────────────────────────────────────────── */}
      {activeTab === "pipeline" && (
        <div className="mt-8 space-y-8">
          {/* Tailoring Cut Sheet */}
          <div className="rounded-card border border-mist bg-bone p-6 dark:border-edge dark:bg-carbon">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xl">✂️</span>
              <h2 className="font-display text-base font-semibold">Tailoring Cut Sheet</h2>
            </div>
            <p className="text-xs text-ink/50 dark:text-bone/45">Aggregated sizes and lengths for all active (non-completed) paid orders.</p>
            {tailoringSheet.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-mist bg-surface text-left text-xs uppercase tracking-wider text-ink/60 dark:border-edge dark:bg-carbon dark:text-bone/60">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Design</th>
                      <th className="px-4 py-3 font-semibold">Size</th>
                      <th className="px-4 py-3 font-semibold">Length</th>
                      <th className="px-4 py-3 font-semibold text-right">Qty to Cut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tailoringSheet.map((row) => (
                      <tr key={`${row.name}-${row.size}-${row.length}`} className="border-b border-mist/60 last:border-0 dark:border-edge/60">
                        <td className="px-4 py-3 font-semibold">{row.name}</td>
                        <td className="px-4 py-3">{row.size}</td>
                        <td className="px-4 py-3">{row.length}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 font-mono text-xs font-bold text-gold">
                            {row.qty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-6 text-center text-sm text-ink/50 dark:text-bone/50 py-4">No active orders in the pipeline.</p>
            )}
          </div>

          {/* Production Pipeline Columns */}
          <div>
            <h2 className="font-display text-base font-semibold mb-4">Production Pipeline</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {PRODUCTION_STEPS.map((step) => {
                const stepOrders = pipelineOrders.filter((o) => (o.productionStatus ?? "pending") === step.key || (step.key === "received" && !(o.productionStatus)));
                const nextStepIndex = PRODUCTION_STEPS.findIndex((s) => s.key === step.key) + 1;
                const nextStep = PRODUCTION_STEPS[nextStepIndex];

                return (
                  <div key={step.key} className={`rounded-card border-2 p-4 ${step.color}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{step.icon}</span>
                      <h3 className="font-display text-sm font-semibold">{step.label}</h3>
                      <span className="ml-auto rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-bold dark:bg-bone/10">
                        {stepOrders.length}
                      </span>
                    </div>
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {stepOrders.map((order) => (
                        <div key={order.id} className="rounded-lg border border-mist/50 bg-bone/80 p-3 dark:border-edge/50 dark:bg-ink/40">
                          <p className="font-mono text-[11px] font-semibold text-gold truncate">{order.id}</p>
                          <p className="text-xs mt-1 font-semibold truncate">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                          <div className="mt-1.5 text-[11px] text-ink/50 dark:text-bone/50 space-y-0.5">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <p key={idx} className="truncate">
                                {item.name} {item.size ? `· ${item.size}` : ""} ×{item.quantity}
                              </p>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-ink/40 dark:text-bone/40">+{order.items.length - 2} more</p>
                            )}
                          </div>
                          {nextStep && (
                            <button
                              type="button"
                              disabled={updatingProductionId === order.id}
                              onClick={() => void handleProductionStatusUpdate(order.id, nextStep.key)}
                              className="mt-2 w-full rounded-lg bg-gold/15 px-2 py-1.5 text-[11px] font-semibold text-gold hover:bg-gold/25 disabled:opacity-50 transition-colors"
                            >
                              {updatingProductionId === order.id ? "Updating…" : `Move → ${nextStep.label}`}
                            </button>
                          )}
                        </div>
                      ))}
                      {stepOrders.length === 0 && (
                        <p className="text-center text-xs text-ink/40 dark:text-bone/40 py-6">Empty</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: LOGISTICS ────────────────────────────────────────────── */}
      {activeTab === "logistics" && (
        <div className="mt-8 space-y-6">
          {/* Filters + Export */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Zone Filter */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-ink/65 dark:text-bone/65">Zone</span>
                <select
                  value={logisticsZoneFilter}
                  onChange={(e) => setLogisticsZoneFilter(e.target.value)}
                  className="rounded-card border border-mist bg-bone px-3 py-2 text-sm focus:border-gold focus:outline-none dark:border-edge dark:bg-carbon dark:text-bone"
                >
                  <option value="all">All Zones</option>
                  {LAGOS_ZONES.map((z) => (
                    <option key={z.name} value={z.name}>{z.name}</option>
                  ))}
                </select>
              </div>

              {/* Fulfillment Filter */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-ink/65 dark:text-bone/65">Fulfillment</span>
                <select
                  value={logisticsFulfillmentFilter}
                  onChange={(e) => setLogisticsFulfillmentFilter(e.target.value)}
                  className="rounded-card border border-mist bg-bone px-3 py-2 text-sm focus:border-gold focus:outline-none dark:border-edge dark:bg-carbon dark:text-bone"
                >
                  <option value="all">All</option>
                  <option value="delivery">Delivery</option>
                  <option value="pickup">Pickup</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCsvExport}
              className="btn-primary py-2 text-xs flex items-center gap-2"
            >
              <span>📋</span> Export CSV for Dispatch
            </button>
          </div>

          {/* Zone Summary Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LAGOS_ZONES.map((zone) => {
              const zoneCount = orders.filter((o) => {
                const st = o.shippingAddress?.state ?? "";
                return st.includes(`(${zone.name})`);
              }).length;
              return (
                <button
                  key={zone.name}
                  type="button"
                  onClick={() => setLogisticsZoneFilter(logisticsZoneFilter === zone.name ? "all" : zone.name)}
                  className={`rounded-card border p-4 text-left transition-all ${
                    logisticsZoneFilter === zone.name
                      ? "border-gold bg-gold/10 ring-1 ring-gold/30"
                      : "border-mist bg-bone hover:border-gold/40 dark:border-edge dark:bg-carbon"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/40 dark:text-bone/45">{zone.name}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-ink dark:text-bone">{zoneCount}</p>
                  <p className="mt-0.5 text-[11px] text-ink/50 dark:text-bone/50">delivery orders</p>
                </button>
              );
            })}
          </div>

          {/* Dispatch Table */}
          <div className="overflow-x-auto rounded-card border border-mist dark:border-edge">
            <table className="w-full text-sm">
              <thead className="border-b border-mist bg-surface text-left text-xs uppercase tracking-wider text-ink/60 dark:border-edge dark:bg-carbon dark:text-bone/60">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Zone / Address</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3 font-semibold">Fulfillment</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {logisticsOrders.map((order) => (
                  <tr key={order.id} className="border-b border-mist/60 last:border-0 dark:border-edge/60">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{order.customer.firstName} {order.customer.lastName}</p>
                      <p className="text-xs text-ink/50 dark:text-bone/50">{order.customer.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs">{order.customer.phone}</td>
                    <td className="px-4 py-3 text-xs">
                      {order.fulfillment === "delivery" && order.shippingAddress ? (
                        <div>
                          <p className="font-semibold">{order.shippingAddress.state}</p>
                          <p className="text-ink/50 dark:text-bone/50 mt-0.5">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                        </div>
                      ) : (
                        <span className="text-ink/50 dark:text-bone/50">Store Pickup</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs space-y-0.5 max-w-[180px]">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="truncate">{item.name} ×{item.quantity}{item.size ? ` (${item.size})` : ""}</p>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                        order.fulfillment === "delivery" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      }`}>
                        {order.fulfillment}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold">{formatPrice(order.total)}</td>
                  </tr>
                ))}
                {logisticsOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-ink/50 dark:text-bone/50">
                      No orders match these filters.
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
                        <img
                          src={item.image || "/hanger-placeholder.svg"}
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/hanger-placeholder.svg";
                          }}
                          className="h-10 w-8 rounded-card object-cover"
                        />
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
