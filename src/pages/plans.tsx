import { useGetPlans } from "@/api/user";
import { SearchIcon } from "@/components/icons";
import ImageEl from "@/components/image";
import Modal from "@/components/modal";
import { formatToNaira } from "@/utils";
import { Dispatch, SetStateAction, useState } from "react";

const Page = () => {
  const [editIdSelected, setEditIdSelected] = useState(null as null | string);

  const {
    filterSelected,
    setFilterSelected,
    categorySelected,
    setCategorySelected,
    data,
    filters,
    isLoading,
  } = useGetPlans();

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Variation Service</h1>
          <p className="mt-2">
            Here is a list of all Data Services provided on the platform.
          </p>
        </div>

        <div className="w-[390px] bg-white py-3 h-fit px-4 flex items-center gap-2.5 border border-[#E6E6E6] rounded">
          <SearchIcon />
          <input
            type="search"
            className="outline-none bg-transparent text-sm font-medium w-full"
            placeholder="Search by ID, Name, Email, Phone number"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex mt-10 gap-4">
          {filters.map((filter, index) => (
            <button
              onClick={() => setFilterSelected(filter)}
              key={index}
              className={`px-6 py-2 cursor-pointer font-semibold rounded capitalize ${
                filterSelected.title === filter.title
                  ? "bg-[#173842] text-white"
                  : "bg-white"
              }`}
            >
              {filter.title}
            </button>
          ))}
        </div>

        {/* <div className="flex items-center gap-4">
          <h4 className="text-sm">Sort by:</h4>
          <div className="bg-white border border-[#E6E6E6] px-4 py-2">
            <select
              name="sort"
              id="sort"
              className="bg-transparent pr-2 text-sm"
            >
              <option value="date">Date created</option>
              <option value="date">Date created</option>
              <option value="date">Date created</option>
              <option value="date">Date created</option>
            </select>
          </div>
        </div> */}
      </div>

      <div className="mt-10">
        <h4 className="text-lg font-black">SERVICE PROVIDERS</h4>

        <div className="flex mt-2 gap-4">
          {filterSelected.category.map((provider, index) => (
            <button
              onClick={() => setCategorySelected(provider)}
              key={index}
              className={`px-6 py-2 cursor-pointer font-semibold flex gap-3 items-center rounded uppercase ${
                categorySelected === provider
                  ? "bg-[#173842] text-white"
                  : "bg-white"
              }`}
            >
              {provider}
              {filterSelected.title === "Data" && (
                <ImageEl src={`/images/${provider}.png`} alt="provider" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 bg-white text-[#2B2B2B] text-sm">
        <div className="px-3 bg-[#E8EBEC] py-5 flex justify-between sticky top-[88px]">
          {/* <span className="flex-[1] font-bold text-center">ID</span> */}
          <span className="flex-[1] font-bold text-center">CODE</span>
          <span className="flex-[2] font-bold text-center">TITLE</span>
          <span className="flex-[1] font-bold text-center">AMOUNT</span>
          <span className="flex-[1] font-bold text-center">FIXED PRICE</span>
          <span className="flex-[1]" />
        </div>

        {isLoading ? (
          <div className="h-[60vh] grid place-content-center">
            <span className="loader" />
          </div>
        ) : data.length < 1 ? (
          <div className="h-[40vh] grid place-content-center">
            <span className="text-gray-500 italic">No variation</span>
          </div>
        ) : (
          <div className="divide-y divide-gray-300">
            {data?.map((data, index) => (
              <ListBox
                data={data}
                key={index}
                providerSelected={categorySelected}
                setEditIdSelected={setEditIdSelected}
              />
            )) || []}
          </div>
        )}
      </div>

      <EditModal
        editIdSelected={editIdSelected}
        setEditIdSelected={setEditIdSelected}
      />
    </div>
  );
};

const ListBox = ({
  data,
  providerSelected,
  setEditIdSelected,
}: {
  data: Variation;
  providerSelected: string;
  setEditIdSelected: Dispatch<SetStateAction<string | null>>;
}) => {
  const { amount, fixedPrice, name, variationCode } = data;

  return (
    <div className="px-3 py-5 flex justify-between items-center">
      <span className="flex-[1] text-center font-bold">{variationCode}</span>
      <div className="flex-[2] flex justify-center items-center gap-4">
        <h4 className="font-bold uppercase">{name}</h4>
      </div>
      <span className="capitalize flex-[1] text-center">
        {formatToNaira(amount)}
      </span>
      <span className="flex-[1] text-center">{fixedPrice ? "Yes" : "No"}</span>

      <div className="flex-[1] flex justify-center">
        <button
          onClick={() => setEditIdSelected(providerSelected)}
          className="px-6 py-2 cursor-pointer font-semibold flex gap-3 items-center rounded bg-[#173842] text-[#32CD32]"
        >
          Edit Price
        </button>
      </div>
    </div>
  );
};

const EditModal = ({
  editIdSelected,
  setEditIdSelected,
}: {
  editIdSelected: string | null;
  setEditIdSelected: Dispatch<SetStateAction<string | null>>;
}) => {
  return (
    <Modal
      openModal={!!editIdSelected}
      closeModal={() => setEditIdSelected(null)}
      title="Edit Price"
    >
      <div className="px-10 mt-10 w-[600px]">
        <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
          <ImageEl src={`/images/${editIdSelected}.png`} alt="provider" />
          <h4 className="font-bold uppercase">{editIdSelected} AWUF</h4>
        </div>

        <div className="mt-8">
          <span className="text-[#808080] font-medium">Initial Price</span>
          <div className="px-4 py-4 bg-white rounded-lg mt-2">
            <span className="font-medium">₦250/GB</span>
          </div>
        </div>

        <div className="mt-8">
          <span className="text-[#808080] font-medium">Enter New price</span>
          <input
            type="text"
            placeholder="₦0"
            className="px-4 py-4 bg-white rounded-lg mt-2 block w-full border border-gray-300 font-medium"
          />
        </div>

        <button
          onClick={() => setEditIdSelected(null)}
          className="px-6 py-4 w-full text-xl cursor-pointer font-bold mt-10 rounded-lg bg-[#173842] text-[#32CD32]"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default Page;
