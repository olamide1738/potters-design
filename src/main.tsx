import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useProductStore } from "./store/useProductStore";
import { useAuthStore } from "./store/useAuthStore";
import "./index.css";

// Start the live product feed and auth listener for the app's lifetime.
useProductStore.getState().subscribe();
useAuthStore.getState().init();

// Google Translate rewrites text nodes React manages, which can make React's
// reconciler throw on removeChild/insertBefore. Guard both so translation can't
// crash the app during navigation. (Standard react-i18n / google-translate fix.)
if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) return child;
    // eslint-disable-next-line prefer-rest-params
    return originalRemoveChild.apply(this, arguments as never) as T;
  };
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    // eslint-disable-next-line prefer-rest-params
    return originalInsertBefore.apply(this, arguments as never) as T;
  };
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
