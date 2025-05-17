import { useEffect } from "react";

type usePageLoadProps = {
  onLoad: () => void
  onReload: () => void
}

export const usePageLoad = ({onLoad, onReload}: usePageLoadProps) => {
  useEffect(() => {
    const handleLoad = () => {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const isReload = navEntry.type === "reload";
      if (isReload) {
        onReload()
      } else {
        onLoad();
      }
    };

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);
}