import { useGetUsers } from "@/api/user";
import { SearchIcon } from "@/components/icons";
import Layout from "@/components/layout";
import Status from "@/components/status";
import UserModal from "@/components/userModal";
import { formatToNaira, parseDateTime } from "@/utils";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const filters = ["all", "verified", "unverified", "deactivated"] as const;

const Page = () => {
  const {
    users,
    setUsers,
    isLoading,
    page,
    totalPages,
    totalCount,
    limit,
    setPage,
    filter,
    setFilter,
    sort,
    setSort,
    sortOrder,
    setSortOrder,
    search,
    setSearch,
  } = useGetUsers();

  const [userSelected, setUserSelected] = useState<User | null>(null);

  // Local search input + debounce
  const [searchTerm, setSearchTerm] = useState<string>(search || "");
  useEffect(() => {
    const timer = setTimeout(() => {
      // Update hook search and reset to first page
      setPage(1);
      setSearch(searchTerm);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearch, setPage]);

  // When filter or sort is changed, reset page to 1 (UI-level)
  const handleFilterChange = (f: typeof filter) => {
    setPage(1);
    setFilter(f);
  };

  const handleSortChange = (val: string) => {
    // val corresponds to UI select values (date, balance, role, name, referralPoints, lastActive)
    setPage(1);
    setSort(val as any);
  };

  const topRef = useRef(null as null | HTMLDivElement);

  return (
    <Layout>
      <div style={{ pointerEvents: isLoading ? "none" : "auto" }}>
        <div className="flex justify-between">
          <div ref={topRef}>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="mt-2">Here is a list of all users on the platform</p>
          </div>

          <div className="w-[390px] bg-white py-3 h-fit px-4 flex items-center gap-2.5 border border-[#E6E6E6] rounded">
            <SearchIcon />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              className="outline-none bg-transparent text-sm font-medium w-full"
              placeholder="Search by name or email"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex mt-10 gap-4">
            {filters.map((f) => (
              <button
                onClick={() => handleFilterChange(f as any)}
                key={f}
                className={`px-6 py-2 cursor-pointer font-semibold rounded capitalize ${
                  filter === f ? "bg-[#173842] text-white" : "bg-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <h4 className="text-sm">Sort by:</h4>
            <div className="bg-white border border-[#E6E6E6] px-4 py-2 flex items-center gap-3">
              <select
                name="sort"
                id="sort"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent pr-2 text-sm"
              >
                <option value="date">Date joined</option>
                <option value="balance">Highest Balance</option>
                <option value="role">Role</option>
                <option value="referralPoints">Referral Points</option>
                <option value="lastActive">Last Active</option>
              </select>

              {/* Order toggle */}
              <button
                onClick={() => {
                  setPage(1);
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                }}
                className="px-3 py-1 border rounded text-sm"
                title="Toggle sort order"
              >
                {sortOrder === "desc" ? "Desc" : "Asc"}
              </button>
            </div>
          </div>
        </div>

        {/* User list header */}
        <div className="mt-10 bg-white text-[#2B2B2B] text-sm">
          <div className="flex justify-between items-center px-3 py-7">
            <h3 className="text-lg font-black">Users</h3>
            <p className="text-sm text-gray-600">
              Showing {users.length} of {totalCount} users
            </p>
          </div>

          <div className="px-3 bg-[#E8EBEC] py-5 flex justify-between sticky top-[88px]">
            <span className="flex-[1.5] font-bold text-center">CUSTOMER</span>
            <span className="flex-[1] font-bold text-center">PHONE NUMBER</span>
            <span className="flex-[1] font-bold text-center">ROLE</span>
            <span className="flex-[1] font-bold text-center">BALANCE</span>
            <span className="flex-[1] font-bold text-center">STATUS</span>
            <span className="flex-[1] font-bold text-center">EMAIL</span>
            <span className="flex-[1] font-bold text-center">DATE</span>
            <span className="flex-[1]"></span>
          </div>

          {isLoading ? (
            <div className="h-[60vh] grid place-content-center">
              <span className="loader" />
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
                  key={data.id ?? index}
                  setUserSelected={setUserSelected}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            className="px-4 py-2 bg-[#68B9CE] cursor-pointer disabled:cursor-auto rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => {
              setPage(Math.max(1, page - 1));
              topRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Prev
          </button>

          <p className="text-sm">
            Page <b>{page}</b> of <b>{totalPages}</b> — showing <b>{limit}</b>{" "}
            per page
          </p>

          <button
            className="px-4 py-2 bg-[#68B9CE] cursor-pointer disabled:cursor-auto rounded disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => {
              setPage(Math.min(totalPages, page + 1));
              topRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Next
          </button>
        </div>

        <UserModal
          userSelected={userSelected}
          setUserSelected={setUserSelected}
          setUsers={setUsers}
        />
      </div>
    </Layout>
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
    isActive,
    walletBalance,
    phoneNumber,
    role,
  } = data;

  const color = isEmailVerified ? "#21C239" : "#F23737";
  const statusColor = isActive ? "#21C239" : "#F23737";
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
      <Status value={isActive ? "Active" : "Deactivated"} color={statusColor} />
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
