import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { SearchIcon } from "@/components/icons";
import Status from "@/components/status";
import { formatToNaira, parseDateTime } from "@/utils";
import { useGetTransactions } from "@/api/user";
import TransactionModal from "@/components/transactionModal";

export const serviceFilters = [
  "airtime",
  "data",
  "betting",
  "electricity",
  "tv",
  "examPin",
] as const;
export const statusFilters = ["all", "SUCCESS", "FAILED", "PENDING"] as const;

const Page = () => {
  const {
    transactions,
    isLoading,
    page,
    setPage,
    totalPages,
    limit,
    search,
    setSearch,
    sort,
    setSort,
    sortOrder,
    setSortOrder,
    service,
    setService,
    status,
    setStatus,
    totalCount,
  } = useGetTransactions();

  const [transactionSelected, setTransactionSelected] =
    useState<BaseTransaction | null>(null);

  const [searchTerm, setSearchTerm] = useState(search || "");
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearch, setPage]);

  const topRef = useRef(null as null | HTMLDivElement);

  return (
    <div style={{ pointerEvents: isLoading ? "none" : "auto" }}>
      <div className="flex justify-between">
        <div ref={topRef}>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="mt-2">
            Here is a list of all transactions on the platform
          </p>
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

      {/* Filters */}
      <div className="flex justify-between mt-6">
        <div className="">
          <div className="flex gap-4">
            {serviceFilters.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setPage(1);
                  setService(f);
                }}
                className={`px-4 py-2 font-semibold rounded capitalize ${
                  service === f ? "bg-[#173842] text-white" : "bg-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-2">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setPage(1);
                  setStatus(s);
                }}
                className={`px-4 py-2 lowercase font-semibold rounded ${
                  status === s ? "bg-[#173842] text-white" : "bg-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <h4 className="text-sm">Sort by:</h4>
          <div className="bg-white border border-[#E6E6E6] px-4 py-2 flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => {
                setPage(1);
                setSort(e.target.value as any);
              }}
              className="bg-transparent pr-2 text-sm"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
            <button
              onClick={() => {
                setPage(1);
                setSortOrder(sortOrder === "desc" ? "asc" : "desc");
              }}
              className="px-3 py-1 border rounded text-sm"
            >
              {sortOrder === "desc" ? "Desc" : "Asc"}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-10 bg-white text-sm">
        <div className="flex justify-between items-center px-3 py-7">
          <h3 className="text-lg font-black">Transactions</h3>
          <p className="text-sm text-gray-600">
            Showing {transactions.length} of {totalCount} transactions
          </p>
        </div>

        <div className="px-3 bg-[#E8EBEC] py-5 flex justify-between sticky top-[88px]">
          <span className="flex-[1] font-bold text-center">ID</span>
          <span className="flex-[2] font-bold text-center">CUSTOMER</span>
          <span className="flex-[1] font-bold text-center">SERVICE</span>
          <span className="flex-[1] font-bold text-center">AMOUNT</span>
          <span className="flex-[1] font-bold text-center">STATUS</span>
          <span className="flex-[1] font-bold text-center">DATE</span>
          <span className="flex-[1]"></span>
        </div>

        {isLoading ? (
          <div className="h-[60vh] grid place-content-center">
            <span className="loader" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="h-[40vh] grid place-content-center">
            <span className="text-gray-500 italic">No transactions</span>
          </div>
        ) : (
          <div className="divide-y divide-gray-300">
            {transactions.map((tx, index) => (
              <ListBox
                key={index}
                data={tx}
                setTransactionSelected={setTransactionSelected}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 bg-[#68B9CE] rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => {
            setPage(page - 1);
            topRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Prev
        </button>

        <p className="text-sm">
          Page <b>{page}</b> of <b>{totalPages}</b> — showing <b>{limit}</b> per
          page
        </p>

        <button
          className="px-4 py-2 bg-[#68B9CE] rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => {
            setPage(page + 1);
            topRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Next
        </button>
      </div>

      <TransactionModal
        transactionSelected={transactionSelected}
        setTransactionSelected={setTransactionSelected}
        service={service}
      />
    </div>
  );
};

const ListBox = ({
  data,
  setTransactionSelected,
}: {
  data: BaseTransaction;
  setTransactionSelected: Dispatch<SetStateAction<BaseTransaction | null>>;
}) => {
  const { amount, createdAt, id, status, title, user } = data;
  const { date, time } = parseDateTime(createdAt);

  return (
    <div className="px-3 py-5 flex justify-between items-center">
      <span className="flex-[1] text-center font-bold">{id}</span>
      <div className="flex-[2] text-center">
        <h4 className="font-bold">
          {user.firstName} {user.lastName}
        </h4>
        <h5 className="text-xs">{user.email}</h5>
      </div>
      <span className="capitalize flex-[1] text-center">{title}</span>
      <span className="flex-[1] text-center">{formatToNaira(amount)}</span>
      <Status value={status} />
      <div className="flex-[1] text-center">
        <h4>{date}</h4>
        <span className="text-[#A6A6A6]">{time}</span>
      </div>
      <div className="flex-[1] flex justify-center">
        <button
          onClick={() => setTransactionSelected(data)}
          className="px-6 py-2 cursor-pointer font-semibold flex gap-3 items-center rounded bg-[#173842] text-[#32CD32]"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default Page;
