import {
  ArrowRightIcon,
  DepositIconAlt,
  TransactionIconAlt,
  UserAltIcon,
} from "@/components/icons";
import Status from "@/components/status";
import { transactions } from "@/utils";

const Page = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome Oluwafemi</h1>
      <p className="mt-2">
        Overview of the entire activity on the app, Bill Payments, Deposits and
        all that.
      </p>

      <div className="mt-10 flex gap-2">
        <article className="pt-9 pb-4 px-4 bg-white rounded flex-1">
          <div className="flex gap-4">
            <UserAltIcon />
            <div>
              <h3 className="font-bold">Total User</h3>
              <h3 className="font-bold mt-2 text-2xl">500</h3>
            </div>
          </div>

          <button className="mt-8 py-3 cursor-pointer w-full rounded flex items-center justify-center gap-3 bg-[#E9F9EB] text-[#32CD32] text-sm font-bold">
            View all <ArrowRightIcon color="#32CD32" />
          </button>
        </article>

        <article className="pt-9 pb-4 px-4 bg-white rounded flex-1">
          <div className="flex gap-4">
            <DepositIconAlt />
            <div>
              <h3 className="font-bold">Deposits</h3>
              <h3 className="font-bold mt-2 text-2xl">₦500,000</h3>
            </div>
          </div>

          <button className="mt-8 py-3 cursor-pointer w-full rounded flex items-center justify-center gap-3 bg-[#E6F4FF] text-[#0068B3] text-sm font-bold">
            View all <ArrowRightIcon color="#0068B3" />
          </button>
        </article>

        <article className="pt-9 pb-4 px-4 bg-white rounded flex-1">
          <div className="flex gap-4">
            <TransactionIconAlt />
            <div>
              <h3 className="font-bold">Total Transactions</h3>
              <h3 className="font-bold mt-2 text-2xl">₦500,000</h3>
            </div>
          </div>

          <button className="mt-8 py-3 cursor-pointer w-full rounded flex items-center justify-center gap-3 bg-[#FEEBEB] text-[#F23737] text-sm font-bold">
            View all <ArrowRightIcon color="#F23737" />
          </button>
        </article>

        <article className="pt-9 pb-4 px-4 bg-white rounded flex-1">
          <div className="flex gap-4">
            <TransactionIconAlt />
            <div>
              <h3 className="font-bold">Bill Payments</h3>
              <h3 className="font-bold mt-2 text-2xl">₦500,000</h3>
            </div>
          </div>

          <button className="mt-8 py-3 cursor-pointer w-full rounded flex items-center justify-center gap-3 bg-[#E9F9EB] text-[#32CD32] text-sm font-bold">
            View all <ArrowRightIcon color="#32CD32" />
          </button>
        </article>
      </div>

      <div className="mt-10 bg-white text-[#2B2B2B] text-sm">
        <div className="flex justify-between items-center px-3 py-7">
          <h3 className="text-lg font-black">Bill payment Transaction</h3>
          <h5 className=" font-bold text-[#0068B3]">Total User</h5>
        </div>

        <div className="px-3 bg-[#E8EBEC] py-5 flex justify-between sticky top-[88px]">
          <span className="flex-[1] font-bold text-center">ID</span>
          <span className="flex-[2] font-bold text-center">CUSTOMER</span>
          <span className="flex-[1] font-bold text-center">SERVICE</span>
          <span className="flex-[1] font-bold text-center">AMOUNT</span>
          <span className="flex-[1] font-bold text-center">STATUS</span>
          <span className="flex-[1] font-bold text-center">DATE</span>
        </div>

        <div className="divide-y divide-gray-300">
          {transactions.map((data, index) => (
            <ListBox data={data} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ListBox = ({ data }: { data: (typeof transactions)[0] }) => {
  const {
    amount,
    date,
    email,
    firstName,
    lastName,
    service,
    status,
    time,
    id,
  } = data;

  return (
    <div className="px-3 py-5 flex justify-between items-center">
      <span className="flex-[1] text-center font-bold">{id}</span>
      <div className="flex-[2] text-center">
        <h4 className="font-bold ">
          {firstName} {lastName}
        </h4>
        <h5 className="flex-[1] text-center">{email}</h5>
      </div>
      <span className="capitalize flex-[1] text-center">{service}</span>
      <span className="flex-[1] text-center">{amount}</span>
      <Status value={status} />
      <div className="flex-[1] text-center">
        <h4 className="">{date}</h4>
        <span className="text-[#A6A6A6]">{time}</span>
      </div>
    </div>
  );
};

export default Page;
