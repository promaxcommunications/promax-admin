import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "./modal";
import { API } from "@/api";

const EditVariationModal = ({
  editVariationSelected,
  setEditVariationSelected,
  type,
  setData,
  setVariation,
}: {
  editVariationSelected: Variation | null;
  setEditVariationSelected: Dispatch<SetStateAction<Variation | null>>;
  type: string;
  setData: Dispatch<SetStateAction<Variation[]>>;
  setVariation: Dispatch<SetStateAction<Variation[]>>;
}) => {
  const [form, setForm] = useState({
    name: "",
    platformPrice: "",
  });

  useEffect(() => {
    if (!editVariationSelected) return;

    setForm({
      name: editVariationSelected.name,
      platformPrice: editVariationSelected.platformPrice || "",
    });
  }, [editVariationSelected]);

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    if (!editVariationSelected) return;
    setIsLoading(true);

    // API call to update variation
    try {
      const res = await API.put(
        `/admin/variations/${type}/${editVariationSelected?.id}`,
        form
      );

      if (res.data) {
        // update the local state of data and variation
        setData((prev) =>
          prev.map((item) =>
            item.id === editVariationSelected.id ? { ...item, ...form } : item
          )
        );
        setVariation((prev) =>
          prev.map((item) =>
            item.id === editVariationSelected.id ? { ...item, ...form } : item
          )
        );

        setEditVariationSelected(null);
      } else {
        console.log("Failed to update variation", res);
      }
    } catch (error) {
      console.error("Failed to update variation", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!editVariationSelected) return null;

  const { amount, name, variationCode } = editVariationSelected;

  const title = `Edit ${variationCode}`;

  return (
    <Modal
      openModal={!!editVariationSelected}
      closeModal={() => setEditVariationSelected(null)}
      title={title}
    >
      <div className="px-10 mt-10 w-[600px]">
        <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
          <h4 className="font-bold uppercase">{name}</h4>
        </div>

        <div className="mt-8">
          <span className="text-[#808080] font-medium">Initial Amount</span>
          <div className="px-4 py-4 bg-white rounded-lg mt-2">
            <span className="font-medium">{amount}</span>
          </div>
        </div>

        <div className="mt-8">
          <span className="text-[#808080] font-medium">Enter New Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Variation Name"
            className="px-4 py-4 bg-white rounded-lg mt-2 block w-full border border-gray-300 font-medium"
          />
        </div>

        <div className="mt-8">
          <span className="text-[#808080] font-medium">Enter New Amount</span>
          <input
            type="text"
            placeholder="₦0"
            value={form.platformPrice}
            onChange={(e) =>
              setForm({ ...form, platformPrice: e.target.value })
            }
            className="px-4 py-4 bg-white rounded-lg mt-2 block w-full border border-gray-300 font-medium"
          />
        </div>

        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="px-6 py-4 w-full text-xl cursor-pointer font-bold mt-10 rounded-lg bg-[#173842] text-[#32CD32]"
        >
          {isLoading ? <span className="loader-small"></span> : "Save"}
        </button>
      </div>
    </Modal>
  );
};

export default EditVariationModal;
