import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "./modal";
import { API } from "@/api";

const EditMarkupModal = ({
  editMarkupSelected,
  setEditMarkupSelected,
  setData,
}: {
  editMarkupSelected: Markup | null;
  setEditMarkupSelected: Dispatch<SetStateAction<Markup | null>>;
  setData: Dispatch<SetStateAction<Markup[]>>;
}) => {
  const [form, setForm] = useState({
    decrementPercentage: null as number | null,
    incrementPercentage: null as number | null,
    isActive: false,
  });

  useEffect(() => {
    if (!editMarkupSelected) return;
    const { decrementPercentage, incrementPercentage, isActive } =
      editMarkupSelected;

    setForm({
      decrementPercentage: decrementPercentage ?? null,
      incrementPercentage: incrementPercentage ?? null,
      isActive: isActive,
    });
  }, [editMarkupSelected]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async () => {
    if (!editMarkupSelected) return;
    setIsLoading(true);
    setError("");

    // Normalize zeros to null and validate mutual exclusivity
    const inc =
      form.incrementPercentage && form.incrementPercentage > 0
        ? form.incrementPercentage
        : null;
    const dec =
      form.decrementPercentage && form.decrementPercentage > 0
        ? form.decrementPercentage
        : null;

    if (inc === null && dec === null) {
      setIsLoading(false);
      setError("Either increment or decrement percentage must be set.");
      return;
    }

    if (inc !== null && dec !== null) {
      setIsLoading(false);
      setError("Only one of increment or decrement percentage can be set.");
      return;
    }

    // Construct payload enforcing exclusivity (other must be null)
    const payload: any = {
      isActive: form.isActive,
    };
    if (inc !== null) {
      payload.incrementPercentage = inc;
    }
    if (dec !== null) {
      payload.decrementPercentage = dec;
    }

    try {
      const res = await API.put(
        `/admin/markups/${editMarkupSelected.serviceType}`,
        payload
      );

      if (res.data) {
        // update the local state of data and markup
        setData((prev) =>
          prev.map((item) =>
            item.id === editMarkupSelected.id
              ? {
                  ...item,
                  incrementPercentage: inc,
                  decrementPercentage: dec,
                  isActive: form.isActive,
                }
              : item
          )
        );

        setEditMarkupSelected(null);
      } else {
        console.log("Failed to update markup", res);
      }
    } catch (error) {
      console.error("Failed to update markup", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!editMarkupSelected) return null;

  const { serviceType } = editMarkupSelected;

  const title = `Edit ${serviceType} Markup`;

  return (
    <Modal
      openModal={!!editMarkupSelected}
      closeModal={() => setEditMarkupSelected(null)}
      title={title}
    >
      <div className="px-10 mt-10 w-[600px]">
        <div className="mt-2 grid grid-cols-2 gap-6">
          <div>
            <span className="text-[#808080] font-medium">
              Increase Percentage
            </span>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="0"
              value={form.incrementPercentage ?? ""}
              onChange={(e) => {
                const num =
                  e.target.value === "" ? null : Number(e.target.value);
                const value = num && num > 0 ? num : null;
                setForm({
                  ...form,
                  incrementPercentage: value,
                  // enforce exclusivity: clear decrement if increment set
                  decrementPercentage:
                    value !== null ? null : form.decrementPercentage,
                });
              }}
              className="px-4 py-4 bg-white rounded-lg mt-2 block w-full border border-gray-300 font-medium"
            />
          </div>

          <div>
            <span className="text-[#808080] font-medium">
              Decrease Percentage
            </span>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="0"
              value={form.decrementPercentage ?? ""}
              onChange={(e) => {
                const num =
                  e.target.value === "" ? null : Number(e.target.value);
                const value = num && num > 0 ? num : null;
                setForm({
                  ...form,
                  decrementPercentage: value,
                  // enforce exclusivity: clear increment if decrement set
                  incrementPercentage:
                    value !== null ? null : form.incrementPercentage,
                });
              }}
              className="px-4 py-4 bg-white rounded-lg mt-2 block w-full border border-gray-300 font-medium"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <input
            id="isActiveToggle"
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-5 w-5 cursor-pointer"
          />
          <label
            htmlFor="isActiveToggle"
            className="cursor-pointer select-none"
          >
            Active
          </label>
        </div>

        <p className="mt-10 text-sm text-center text-red-600">{error}</p>
        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="px-6 py-4 w-full text-xl cursor-pointer font-bold mt-2 rounded-lg bg-[#173842] text-[#32CD32]"
        >
          {isLoading ? <span className="loader-small"></span> : "Save"}
        </button>
      </div>
    </Modal>
  );
};

export default EditMarkupModal;
