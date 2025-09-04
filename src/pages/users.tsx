import { useGetUsers } from "@/api/user";
import { SearchIcon } from "@/components/icons";
import Status from "@/components/status";
import UserModal from "@/components/userModal";
import { formatToNaira, parseDateTime } from "@/utils";
import { Dispatch, SetStateAction, useState } from "react";

const filters = ["all", "verified", "unverified", "deactivated"];

const Page = () => {
  const { users, isLoading } = useGetUsers();
  const [userSelected, setUserSelected] = useState(null as User | null);
  const [filterSelected, setFilterSelected] = useState("all");

  return (
    <div style={{ pointerEvents: isLoading ? "none" : "auto" }}>
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
          {/* <span className="flex-[1] font-bold text-center">ID</span> */}
          <span className="flex-[1.5] font-bold text-center">CUSTOMER</span>
          <span className="flex-[1] font-bold text-center">PHONE NUMBER</span>
          <span className="flex-[1] font-bold text-center">ROLE</span>
          <span className="flex-[1] font-bold text-center">BALANCE</span>
          <span className="flex-[1] font-bold text-center">STATUS</span>
          <span className="flex-[1] font-bold text-center">DATE</span>
          <span className="flex-[1]"></span>
        </div>

        {isLoading ? (
          <div className="h-[60vh] grid place-content-center">
            <span className="loader"></span>
          </div>
        ) : users.length < 1 ? (
          <div className="h-[40vh] grid place-content-center">
            <span className="text-gray-500 italic">No users</span>
          </div>
        ) : (
          <div className="divide-y divide-gray-300">
            {users.map((data, index) => (
              <ListBox
                data={data}
                key={index}
                setUserSelected={setUserSelected}
              />
            ))}
          </div>
        )}
      </div>

      <UserModal
        userSelected={userSelected}
        setUserSelected={setUserSelected}
      />
    </div>
  );
};

const ListBox = ({
  data,
  setUserSelected,
}: {
  data: User;
  setUserSelected: Dispatch<SetStateAction<User | null>>;
}) => {
  const {
    createdAt,
    email,
    firstName,
    lastName,
    isEmailVerified,
    walletBalance,
    phoneNumber,
    role,
  } = data;

  const color = isEmailVerified ? "#21C239" : "#F23737";
  // "#FFAA00";
  const { date, time } = parseDateTime(createdAt);

  return (
    <div className="px-3 py-5 flex justify-between items-center">
      {/* <span className="flex-[1] text-center font-bold">{id}</span> */}
      <div className="flex-[1.5] text-center">
        <h4 className="font-bold ">
          {firstName} {lastName}
        </h4>
        <h5 className="flex-[1] text-center">{email}</h5>
      </div>
      <span className="capitalize flex-[1] text-center">{phoneNumber}</span>
      <span className="flex-[1] text-center">{role}</span>
      <span className="flex-[1] text-center">
        {formatToNaira(walletBalance)}
      </span>
      <Status
        value={isEmailVerified ? "Verified" : "Unverified"}
        color={color}
      />
      <div className="flex-[1] text-center">
        <h4 className="">{date}</h4>
        <span className="text-[#A6A6A6]">{time}</span>
      </div>
      <div className="flex-[1] flex justify-center">
        <button
          onClick={() => setUserSelected(data)}
          className="px-6 py-2 cursor-pointer font-semibold flex gap-3 items-center rounded bg-[#173842] text-[#32CD32]"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default Page;
