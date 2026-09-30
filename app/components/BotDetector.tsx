"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function BotDetector() {
  const pathname = usePathname();
  const reportedEvents = useRef(new Set<string>());

  useEffect(() => {
    // 1. Report JS execution (page load)
    const reportEvent = (type: string, details?: string, dedupe: boolean = true) => {
      // Prevent reporting the exact same event multiple times on the same page load
      const eventKey = `${pathname}-${type}-${details || ''}`;
      if (dedupe) {
        if (reportedEvents.current.has(eventKey)) return;
        reportedEvents.current.add(eventKey);
      }

      fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: details ? `${type}_${details}` : type,
          url: pathname,
        }),
      }).catch((e) => {
        // Silently ignore tracking errors
      });
    };

    // Report initial JS execution
    reportEvent("js_execution");

    // 2. Report user interactions (scroll, mousemove, clicks, inputs)
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        reportEvent("scroll_interaction", undefined, false);
      }, 1000); // 1-second debounce for scroll
    };

    let mouseTimeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        reportEvent("mouse_movement", undefined, false);
      }, 2000); // 2-second debounce for mouse move
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      const link = target.closest('a');
      
      if (button) {
        let btnName = button.innerText?.trim().substring(0, 30).replace(/\s+/g, '_');
        if (!btnName) {
          btnName = button.getAttribute('aria-label') || button.getAttribute('title') || button.id || button.name || 'icon_button';
          btnName = btnName.substring(0, 30).replace(/\s+/g, '_');
        }
        reportEvent("button_click", btnName, false);
      } else if (link) {
        let linkName = link.innerText?.trim().substring(0, 30).replace(/\s+/g, '_');
        if (!linkName) {
          linkName = link.getAttribute('aria-label') || link.getAttribute('title') || link.id || 'icon_link';
          linkName = linkName.substring(0, 30).replace(/\s+/g, '_');
        }
        reportEvent("link_click", linkName, false);
      } else if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'submit') {
        reportEvent("button_click", (target as HTMLInputElement).value || 'submit', false);
      }
    };

    let inputTimeout: NodeJS.Timeout;
    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const inputElement = target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const name = inputElement.name || inputElement.id || inputElement.type || 'unknown_field';
        
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
          reportEvent("field_input", name, false);
        }, 1500); // 1.5-second debounce for typing
      }
    };

    const handleSubmit = (e: Event) => {
      const target = e.target as HTMLFormElement;
      let formIdentifier = target.getAttribute('id') || target.getAttribute('name') || 'form';
      
      let dataStr = "";
      try {
        const formData = new FormData(target);
        const dataObj: Record<string, string> = {};
        formData.forEach((value, key) => {
            dataObj[key] = value.toString().substring(0, 100);
        });
        dataStr = JSON.stringify(dataObj);
      } catch (err) {
        dataStr = "error_reading_data";
      }

      reportEvent("form_submit", `${formIdentifier}_${dataStr}`, false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("input", handleInput, { passive: true });
    document.addEventListener("submit", handleSubmit, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("input", handleInput);
      document.removeEventListener("submit", handleSubmit);
      clearTimeout(mouseTimeout);
      clearTimeout(scrollTimeout);
      clearTimeout(inputTimeout);
    };
  }, [pathname]);

  return null; // This component doesn't render anything visually
}
