"use client";

import { useEffect } from "react";

const POPUNDER_URL =
  "https://affectionatestorage.com/b.3/VE0BPu3up/v_bymWV/JiZSDJ0l3rNITJEyz/O/T/UWz/LdTdcf1oMXTVMu5INETIcq";

// 5 minutes cooldown in milliseconds
const COOLDOWN_MS = 5 * 60 * 1000;

export default function PopunderAd() {
  useEffect(() => {
    const handleUserClick = (e: MouseEvent) => {
      // Only trigger on primary (left) mouse click
      if (e.button !== 0) return;

      try {
        const lastTriggered = localStorage.getItem("popunder_ad_last_shown");
        const now = Date.now();

        if (!lastTriggered || now - Number(lastTriggered) > COOLDOWN_MS) {
          const newWindow = window.open(
            POPUNDER_URL,
            "_blank",
            "noopener,noreferrer"
          );
          if (newWindow) {
            localStorage.setItem("popunder_ad_last_shown", String(now));
          }
        }
      } catch {
        // Silently catch any browser popup restriction
      }
    };

    // Use capture phase so it detects click anywhere on the page
    window.addEventListener("click", handleUserClick, { capture: true });

    return () => {
      window.removeEventListener("click", handleUserClick, { capture: true });
    };
  }, []);

  return null;
}
