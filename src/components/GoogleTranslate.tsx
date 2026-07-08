import { useEffect } from "react";

const SCRIPT_ID = "google-translate-script";
const INCLUDED = "en,fr,de,es";

/**
 * Loads the Google Translate widget once and keeps a hidden mount point.
 * The header dropdown drives it via the `googtrans` cookie (see lib/translate).
 */
export function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    // Global callback the Google script invokes once it loads.
    (window as unknown as Record<string, unknown>).googleTranslateElementInit = () => {
      const g = (window as unknown as { google?: { translate?: { TranslateElement: new (o: object, el: string) => void } } }).google;
      if (g?.translate) {
        new g.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: INCLUDED, autoDisplay: false },
          "google_translate_element",
        );
      }
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div id="google_translate_element" aria-hidden="true" />;
}
