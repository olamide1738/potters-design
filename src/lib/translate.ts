export interface Language {
  code: string; // Google Translate language code ("en" = original)
  label: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
  { code: "es", label: "ES" },
];

/** Read the active language from the Google Translate cookie. */
export function getCurrentLang(): string {
  const match = document.cookie.match(/googtrans=\/[a-z]{2}\/([a-z]{2})/i);
  return match ? match[1] : "en";
}

function writeCookie(value: string) {
  const host = window.location.hostname;
  const bases = [`path=/`, `path=/;domain=${host}`, `path=/;domain=.${host}`];
  bases.forEach((base) => {
    document.cookie = `googtrans=${value};${base}`;
  });
}

function clearCookie() {
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const host = window.location.hostname;
  [`path=/`, `path=/;domain=${host}`, `path=/;domain=.${host}`].forEach((base) => {
    document.cookie = `googtrans=;${base};${expired}`;
  });
}

/**
 * Switch the whole page to `code` via Google Translate.
 * Sets the googtrans cookie and reloads so the widget re-translates on load —
 * the most reliable path (avoids racing the widget's async init).
 */
export function setLanguage(code: string) {
  clearCookie();
  if (code !== "en") writeCookie(`/en/${code}`);
  window.location.reload();
}
