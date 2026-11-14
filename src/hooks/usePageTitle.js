import { useEffect } from "react";

// Sets the browser tab title and moves keyboard focus to the page <h1>
// so screen-reader and keyboard users know the page changed.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} | Margalla Slice (demo)`;
    const heading = document.querySelector("h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }, [title]);
}
