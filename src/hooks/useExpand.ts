import { useEffect, useRef, useState } from "react";

export default function useExpand() {
  const [expand, setExpand] = useState(false);
  const ref = useRef<any>(null);

  function onClickOutside({ target }: any) {
    if (ref && !ref.current.contains(target)) {
      setExpand(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("click", onClickOutside);
    };
  }, []);

  return { expand, setExpand, ref };
}
