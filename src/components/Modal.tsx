import { useEffect, useRef } from "react";

type ModalProps =
  | {
      children?: React.ReactNode;
      hideOneClickOutside?: false;
      hide?: () => void;
    }
  | {
      children?: React.ReactNode;
      hideOneClickOutside: true;
      hide: () => void;
    };

const Modal = ({ children, hide, hideOneClickOutside }: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null);

  function handleOnClickOutside(e: any) {
    if (ref.current && !ref.current.contains(e.target) && hideOneClickOutside) {
      hide();
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (hideOneClickOutside) {
      document.addEventListener("mousedown", handleOnClickOutside);
    }
    return () => {
      document.body.style.overflow = "unset";
      if (hideOneClickOutside) {
        document.removeEventListener("mousedown", handleOnClickOutside);
      }
    };
  }, []);

  return (
    <div
      tabIndex={-1}
      className="fixed inset-0 w-screen h-screen bg-[rgba(10,10,10,0.6)] grid place-items-center pb-32"
    >
      <div
        className="relative w-full max-w-md max-h-full p-5 bg-white rounded-lg shadow-md"
        ref={ref}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
