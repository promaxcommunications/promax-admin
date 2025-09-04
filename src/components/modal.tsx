import { useEffect } from "react";
import { CloseIcon } from "./icons";

const Modal = ({
  openModal,
  closeModal,
  children,
  title,
}: {
  openModal: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  title?: string;
}) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    if (openModal) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = previousOverflow || "";
    }
    return () => {
      body.style.overflow = previousOverflow || "";
    };
  }, [openModal]);

  useEffect(() => {
    if (!openModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openModal, closeModal]);

  return (
    <div
      className={`fixed inset-0 flex justify-end backdrop-blur-sm bg-[#3A383866] transition-all duration-500 ${
        openModal
          ? "opacity-100 visible right-0"
          : "opacity-0 invisible -right-full"
      }`}
      onClick={closeModal}
    >
      <div
        className="min-w-[100px] h-full bg-gray-200 text-black rounded-l-lg relative overflow-y-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-5 flex justify-between items-center border-b border-gray-300">
          <h2 className="font-bold text-2xl">{title}</h2>

          <button className="cursor-pointer" onClick={closeModal}>
            <CloseIcon />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
