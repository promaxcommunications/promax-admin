import { SearchIcon } from "@/components/icons";
import Status from "@/components/status";
import { users } from "@/utils";
import { useState } from "react";

const filters = ["all", "verified", "unverified", "deactivated"];

const Page = () => {
  const [filterSelected, setFilterSelected] = useState("all");

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="mt-2">Here is a list of all users on the platform</p>
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

      <div className="mt-10 bg-white text-[#2B2B2B] text-sm">
        <div className="flex justify-between items-center px-3 py-7">
          <h3 className="text-lg font-black">Users</h3>
        </div>

        <div className="px-3 bg-[#E8EBEC] py-5 flex justify-between sticky top-[88px]">
          <span className="flex-[1] font-bold text-center">ID</span>
          <span className="flex-[2] font-bold text-center">CUSTOMER</span>
          <span className="flex-[1] font-bold text-center">PHONE NUMBER</span>
          <span className="flex-[1] font-bold text-center">
            VIRTUAL ACCOUNT
          </span>
          <span className="flex-[1] font-bold text-center">BALANCE</span>
          <span className="flex-[1] font-bold text-center">STATUS</span>
          <span className="flex-[1] font-bold text-center">DATE</span>
        </div>

        <div className="divide-y divide-gray-300">
          {users.map((data, index) => (
            <ListBox data={data} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ListBox = ({ data }: { data: (typeof users)[0] }) => {
  const {
    date,
    email,
    firstName,
    lastName,
    status,
    time,
    balance,
    phoneNumber,
    virtualAccount,
    id,
  } = data;

  const color =
    status === "verified"
      ? "#21C239"
      : status === "deactivated"
      ? "#F23737"
      : "#FFAA00";

  return (
    <div className="px-3 py-5 flex justify-between items-center">
      <span className="flex-[1] text-center font-bold">{id}</span>
      <div className="flex-[2] text-center">
        <h4 className="font-bold ">
          {firstName} {lastName}
        </h4>
        <h5 className="flex-[1] text-center">{email}</h5>
      </div>
      <span className="capitalize flex-[1] text-center">{phoneNumber}</span>
      <span className="flex-[1] text-center">{virtualAccount}</span>
      <span className="flex-[1] text-center">{balance}</span>
      <Status value={status} color={color} />
      <div className="flex-[1] text-center">
        <h4 className="">{date}</h4>
        <span className="text-[#A6A6A6]">{time}</span>
      </div>
    </div>
  );
};

export default Page;
