import {
  ArrowRightIcon,
  DepositIconAlt,
  TransactionIconAlt,
  UserAltIcon,
} from "@/components/icons";

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
    </div>
  );
};

export default Page;
