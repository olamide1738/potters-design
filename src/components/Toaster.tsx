import { useToastStore } from "@/store/useToastStore";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{ animation: "toast-pop 2.2s ease-in-out forwards" }}
          className="flex items-center gap-3 rounded-card bg-ink px-5 py-3.5 text-sm font-semibold text-bone shadow-2xl dark:bg-bone dark:text-ink"
        >
          <CheckIcon />
          {t.message}
        </div>
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-gold dark:text-gold"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
