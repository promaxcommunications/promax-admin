import { Dispatch, SetStateAction, useState } from "react";
import { parseDateTime } from "@/utils";
import { useGetMarkup } from "@/api/user";
import EditMarkupModal from "@/components/editMarkupModal";
import Status from "@/components/status";

const Page = () => {
  const { data, isLoading, setData } = useGetMarkup();

  const [markupSelected, setMarkupSelected] = useState<Markup | null>(null);

  return (
    <div style={{ pointerEvents: isLoading ? "none" : "auto" }}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Markups</h1>
          <p className="mt-2">Here is a list of all markups on the platform</p>
        </div>

        {/* <button
          className="px-6 py-2 cursor-pointer font-semibold flex gap-3 items-center rounded bg-[#173842] text-[#32CD32]"
        >
          Create Markup
        </button> */}
      </div>

      {/* Table */}
      <div className="mt-10 bg-white text-sm">
        <div className="px-3 bg-[#E8EBEC] py-5 flex justify-between items-center sticky top-[88px]">
          <span className="flex-[1] font-bold text-center">SERVICE TYPE</span>
          <span className="flex-[2] font-bold text-center">DESCRIPTION</span>
          <span className="flex-[1] font-bold text-center">
            INCREMENT <br /> PERCENT
          </span>
          <span className="flex-[1] font-bold text-center">
            DECREMENT <br /> PERCENT
          </span>
          <span className="flex-[1] font-bold text-center">STATUS</span>
          <span className="flex-[1] font-bold text-center">DATE CREATED</span>
          <span className="flex-[1]"></span>
        </div>

        {isLoading ? (
          <div className="h-[60vh] grid place-content-center">
            <span className="loader" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-[40vh] grid place-content-center">
            <span className="text-gray-500 italic">No markups</span>
          </div>
        ) : (
          <div className="divide-y divide-gray-300">
            {data.map((tx, index) => (
              <ListBox
                key={index}
                data={tx}
                setMarkupSelected={setMarkupSelected}
              />
            ))}
          </div>
        )}
      </div>

      <EditMarkupModal
        editMarkupSelected={markupSelected}
        setEditMarkupSelected={setMarkupSelected}
        setData={setData}
      />
    </div>
  );
};

const ListBox = ({
  data,
  setMarkupSelected,
}: {
  data: Markup;
  setMarkupSelected: Dispatch<SetStateAction<Markup | null>>;
}) => {
  const {
    createdAt,
    decrementPercentage,
    description,
    incrementPercentage,
    isActive,
    serviceType,
  } = data;
  const { date, time } = parseDateTime(createdAt);

  return (
    <div className="px-3 py-5 flex justify-between items-center">
      <span className="flex-[1] text-center font-bold uppercase">
        {serviceType}
      </span>
      <span className="flex-[2] text-center">{description}</span>
      <span className="flex-[1] text-center">
        {incrementPercentage || "N/A"}
      </span>
      <span className="flex-[1] text-center">
        {decrementPercentage || "N/A"}
      </span>
      <Status value={isActive ? "ACTIVE" : "INACTIVE"} />
      <div className="flex-[1] text-center">
        <h4>{date}</h4>
        <span className="text-[#A6A6A6]">{time}</span>
      </div>
      <div className="flex-[1] flex justify-center">
        <button
          onClick={() => setMarkupSelected(data)}
          className="px-6 py-2 cursor-pointer font-semibold flex gap-3 items-center rounded bg-[#173842] text-[#32CD32]"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default Page;
