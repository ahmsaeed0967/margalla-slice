import { useEffect, useRef } from "react";

export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add("is-visible");
    }
  }, []);

  return ref;
}