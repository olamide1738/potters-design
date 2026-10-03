import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductPage } from "./pages/ProductPage";
import { AboutPage } from "./pages/AboutPage";
import { CartPage } from "./pages/CartPage";
import { WishlistPage } from "./pages/WishlistPage";
import { TermsPage } from "./pages/TermsPage";
import { FAQPage } from "./pages/FAQPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { RequireAuth } from "./pages/admin/RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "shop/:slug", element: <ProductPage /> },
      { path: "product/:slug", element: <ProductPage /> },
      { path: "products/:slug", element: <ProductPage /> },
      { path: "p/:slug", element: <ProductPage /> },
      { path: "about-us", element: <AboutPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "faq", element: <FAQPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "order-confirmation", element: <OrderConfirmation /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "login", element: <AdminLoginPage /> },
      { index: true, element: <RequireAuth><AdminDashboard /></RequireAuth> },
    ],
  },
]);
