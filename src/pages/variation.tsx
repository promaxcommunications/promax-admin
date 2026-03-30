import { useGetVariations } from "@/api/user";
import EditVariationModal from "@/components/editVariationModal";
import ImageEl from "@/components/image";
import Layout from "@/components/layout";
import { formatToNaira } from "@/utils";
import { Dispatch, SetStateAction, useState } from "react";

const Page = () => {
  const [editVariationSelected, setEditVariationSelected] = useState(
    null as null | Variation
  );

  const {
    filterSelected,
    setFilterSelected,
    categorySelected,
    setCategorySelected,
    data,
    filters,
    isLoading,
    setData,
    setVariation,
  } = useGetVariations();

  return (
    <Layout>
      <div>
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Variation Service</h1>
            <p className="mt-2">
              Here is a list of all Data Services provided on the platform.
            </p>
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
                  <ImageEl src={`/images/${provider?.toLowerCase()}.png`} alt="provider" />
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
            <span className="flex-[1] font-bold text-center">
              PLATFORM AMOUNT
            </span>
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
                  setEditVariationSelected={setEditVariationSelected}
                />
              )) || []}
            </div>
          )}
        </div>

        <EditVariationModal
          editVariationSelected={editVariationSelected}
          setEditVariationSelected={setEditVariationSelected}
          type={filterSelected.query}
          setData={setData}
          setVariation={setVariation}
        />
      </div>
    </Layout>
  );
};

const ListBox = ({
  data,
  setEditVariationSelected,
}: {
  data: Variation;
  setEditVariationSelected: Dispatch<SetStateAction<Variation | null>>;
}) => {
  const { amount, fixedPrice, name, variationCode, platformPrice } = data;

  return (
    <div className="px-3 py-5 flex justify-between items-center">
      <span className="flex-[1] text-center font-bold">{variationCode}</span>
      <div className="flex-[2] flex justify-center items-center gap-4">
        <h4 className="font-bold uppercase">{name}</h4>
      </div>
      <span className="capitalize flex-[1] text-center">
        {formatToNaira(amount)}
      </span>
      <span className="capitalize flex-[1] text-center">
        {formatToNaira(platformPrice!)}
      </span>
      <span className="flex-[1] text-center">{fixedPrice ? "Yes" : "No"}</span>

      <div className="flex-[1] flex justify-center">
        <button
          onClick={() => setEditVariationSelected(data)}
          className="px-6 py-2 cursor-pointer font-semibold flex gap-3 items-center rounded bg-[#173842] text-[#32CD32]"
        >
          Edit Price
        </button>
      </div>
    </div>
  );
};

export default Page;
