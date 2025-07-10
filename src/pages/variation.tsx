import { CloseIcon, SearchIcon } from "@/components/icons";
import ImageEl from "@/components/image";
import Status from "@/components/status";
import { users } from "@/utils";
import { Dispatch, SetStateAction, useState } from "react";

const filters = [
  "all",
  "airtime",
  "betting",
  "cable TV",
  "Data",
  "Electricity",
  "Education",
];

const providers = ["mtn", "glo", "airtel", "9mobile"];

const Page = () => {
  const [filterSelected, setFilterSelected] = useState("all");
  const [providerSelected, setProviderSelected] = useState("mtn");
  const [editIdSelected, setEditIdSelected] = useState(null as null | string);

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
                filterSelected === filter
                  ? "bg-[#173842] text-white"
                  : "bg-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
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
        </div>
      </div>

      <div className="mt-10">
        <h4 className="text-lg font-black">SERVICE PROVIDERS</h4>

        <div className="flex mt-2 gap-4">
          {providers.map((provider, index) => (
            <button
              onClick={() => setProviderSelected(provider)}
              key={index}
              className={`px-6 py-2 cursor-pointer font-semibold flex gap-3 items-center rounded uppercase ${
                providerSelected === provider
                  ? "bg-[#173842] text-white"
                  : "bg-white"
              }`}
            >
              {provider}
              <ImageEl src={`/images/${provider}.png`} alt="provider" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 bg-white text-[#2B2B2B] text-sm">
        <div className="px-3 bg-[#E8EBEC] py-5 flex justify-between sticky top-[88px]">
          {/* <span className="flex-[1] font-bold text-center">ID</span> */}
          <span className="flex-[1] font-bold text-center">SERVICE</span>
          <span className="flex-[1] font-bold text-center">AMOUNT</span>
          <span className="flex-[1] font-bold text-center">INITIAL PRICE</span>
          <span className="flex-[1] font-bold text-center">NEW PRICE</span>
          <span className="flex-[1] font-bold text-center">STATUS</span>
          <span className="flex-[1]" />
        </div>

        <div className="divide-y divide-gray-300">
          {users.map((data, index) => (
            <ListBox
              data={data}
              key={index}
              providerSelected={providerSelected}
              setEditIdSelected={setEditIdSelected}
            />
          ))}
        </div>
      </div>

      <EditModal
        editIdSelected={editIdSelected}
        setEditIdSelected={setEditIdSelected}
      />
    </div>
  );
};

const ListBox = ({
  providerSelected,
  setEditIdSelected,
}: {
  data: unknown;
  providerSelected: string;
  setEditIdSelected: Dispatch<SetStateAction<string | null>>;
}) => {
  return (
    <div className="px-3 py-5 flex justify-between items-center">
      {/* <span className="flex-[1] text-center font-bold">{id}</span> */}
      <div className="flex-[1] flex justify-center items-center gap-4">
        <ImageEl src={`/images/${providerSelected}.png`} alt="provider" />
        <h4 className="font-bold uppercase">{providerSelected} AWUF</h4>
      </div>
      <span className="capitalize flex-[1] text-center">400 GB</span>
      <span className="flex-[1] text-center">₦250/GB</span>
      <span className="flex-[1] text-center">₦255/GB</span>
      <Status value={"active"} />

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
    <div
      className={`fixed inset-0 flex justify-end backdrop-blur-sm bg-[#3A383866] transition-all duration-300 ${
        editIdSelected ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={() => setEditIdSelected(null)}
    >
      <div
        className="w-[700px] h-full bg-gray-200 text-black rounded-l-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 flex justify-between items-center border-b border-gray-300">
          <h2 className="font-bold text-2xl">Edit Price</h2>

          <button
            className="cursor-pointer"
            onClick={() => setEditIdSelected(null)}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-16 mt-10">
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
      </div>
    </div>
  );
};

export default Page;
