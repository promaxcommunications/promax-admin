import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "./modal";
import { formatToNaira, parseDateTime } from "@/utils";
import { useGetUser } from "@/api/user";

const UserModal = ({
  userSelected,
  setUserSelected,
}: {
  userSelected: User | null;
  setUserSelected: Dispatch<SetStateAction<User | null>>;
}) => {
  const { getUser, isLoading, user, setUser } = useGetUser();

  useEffect(() => {
    if (!userSelected) return;

    getUser(userSelected?.id);

    return () => setUser(null);
  }, [userSelected]);

  if (!userSelected) return null;

  const title = `${userSelected.firstName} ${userSelected.lastName}`;
  const { date, time } = parseDateTime(userSelected.createdAt);
  const { date: updatedDate, time: updatedTime } = parseDateTime(
    userSelected.updatedAt
  );

  return (
    <Modal
      openModal={!!userSelected}
      closeModal={() => setUserSelected(null)}
      title={title}
    >
      {isLoading ? (
        <div className="h-[80vh] max-h-[500px] grid place-content-center w-[600px]">
          <span className="loader"></span>
        </div>
      ) : !user ? (
        <div className="h-[80vh] max-h-[500px] grid place-content-center w-[600px]">
          <span className="text-gray-400 italic">
            There is a problem fetching the user
          </span>
        </div>
      ) : (
        <div className="px-10 mt-6 w-[600px] space-y-6 pb-20">
          {/* Profile Info */}
          <h3 className="font-semibold text-lg mb-0">Profile</h3>
          <section className="bg-[#173842] text-white rounded-lg p-4 shadow">
            <div className="space-y-3">
              <p>
                <span className="font-medium">Id:</span> {user.id}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {user.phoneNumber}
              </p>
              <p>
                <span className="font-medium">Role:</span> {user.role}
              </p>
              <p>
                <span className="font-medium">Email Verified:</span>{" "}
                {user.isEmailVerified ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <span className="font-medium">Joined:</span> {date}, {time}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span> {updatedDate}
                , {updatedTime}
              </p>
            </div>
          </section>

          {/* Financial Info */}
          <h3 className="font-semibold text-lg mb-0">Financial</h3>
          <section className="bg-[#173842] text-white rounded-lg p-4 shadow">
            <p>
              <span className="font-medium">Wallet Balance: </span>
              {formatToNaira(user.walletBalance)}
            </p>
            <p>
              <span className="font-medium">Referral Points:</span>{" "}
              {user.referralPoints}
            </p>
          </section>

          {/* Virtual Accounts */}
          <h3 className="font-semibold text-lg mb-0">Virtual Accounts</h3>
          <section className="bg-[#173842] text-white rounded-lg p-4 shadow">
            <ul className="space-y-2">
              {user.virtualAccounts.length < 1 && (
                <span className="text-gray-300 italic">No virtual account</span>
              )}
              {user.virtualAccounts.map((acc, idx) => (
                <li key={idx} className="border p-2 rounded">
                  <p>
                    <span className="font-medium">Bank:</span> {acc.bankName}
                  </p>
                  <p>
                    <span className="font-medium">Account Number:</span>{" "}
                    {acc.accountNumber}
                  </p>
                  <p>
                    <span className="font-medium">Account Name:</span>{" "}
                    {acc.accountName}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Devices */}
          <h3 className="font-semibold text-lg mb-0">Devices</h3>
          <section className="bg-[#173842] text-white rounded-lg p-4 shadow">
            <ul className="space-y-2">
              {user.devices.map((device, idx) => (
                <li key={idx} className="border p-2 rounded">
                  <p>
                    <span className="font-medium">Model:</span> {device.model}
                  </p>
                  <p>
                    <span className="font-medium">OSVersion:</span>{" "}
                    {device.osVersion}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Transactions (show counts only for quick summary) */}
          <h3 className="font-semibold text-lg mb-0">Transactions</h3>
          <section className="bg-[#173842] text-white rounded-lg p-4 shadow">
            <ul className="space-y-1">
              <li>Airtime: {user.airtimeTransactions.length}</li>
              <li>Data: {user.dataTransactions.length}</li>
              <li>Betting: {user.bettingTransactions.length}</li>
              <li>Exam Pins: {user.examPinTransactions.length}</li>
              <li>Electricity: {user.electricityTransactions.length}</li>
              <li>TV Subscriptions: {user.tvSubscriptionTransaction.length}</li>
              <li>Deposit History: {user.paymentHistory.length}</li>
              <li>Refunds: {user.refunds.length}</li>
            </ul>
          </section>

          {/* Referrals */}
          <h3 className="font-semibold text-lg mb-0">Referrals</h3>
          <section className="bg-[#173842] text-white rounded-lg p-4 shadow">
            <p>Referral Codes: {user.referralCodes.length}</p>
            <p>Referred Users: {user.referralsAsReferrer.length}</p>
            <p>
              Was Referred By Someone:{" "}
              {user.referralsAsReferred.length > 0 ? "Yes" : "No"}
            </p>
          </section>

          {/* Airtime Transactions */}
          <Section
            title="Airtime Transactions"
            items={user.airtimeTransactions}
            renderItem={(t) => (
              <>
                <p>Amount: {formatToNaira(t.amount)}</p>
                <p>Phone: {t.phoneNumber}</p>
                <span className="absolute top-1 right-1 bg-gray-200 text-black px-2 py-1 rounded-md text-xs">
                  {t.status}
                </span>
              </>
            )}
          />

          {/* Data Transactions */}
          <Section
            title="Data Transactions"
            items={user.dataTransactions}
            renderItem={(t) => (
              <>
                <p>Amount: {formatToNaira(t.amount)}</p>
                <p>Plan: {t.plan}</p>
                <p>Phone: {t.phoneNumber}</p>
                <span className="absolute top-1 right-1 bg-gray-200 text-black px-2 py-1 rounded-md text-xs">
                  {t.status}
                </span>
              </>
            )}
          />

          {/* Betting Transactions */}
          <Section
            title="Betting Transactions"
            items={user.bettingTransactions}
            renderItem={(t) => (
              <>
                <p>Amount: {formatToNaira(t.amount)}</p>
                <p>Provider: {t.provider}</p>
                <span className="absolute top-1 right-1 bg-gray-200 text-black px-2 py-1 rounded-md text-xs">
                  {t.status}
                </span>
              </>
            )}
          />

          {/* Exam Pin Transactions */}
          <Section
            title="Exam Pin Transactions"
            items={user.examPinTransactions}
            renderItem={(t) => (
              <>
                <p>Amount: {formatToNaira(t.amount)}</p>
                <p>Exam Type: {t.examType}</p>
                <span className="absolute top-1 right-1 bg-gray-200 text-black px-2 py-1 rounded-md text-xs">
                  {t.status}
                </span>
              </>
            )}
          />

          {/* Electricity Transactions */}
          <Section
            title="Electricity Transactions"
            items={user.electricityTransactions}
            renderItem={(t) => (
              <>
                <p>Amount: {formatToNaira(t.amount)}</p>
                <p>Meter: {t.meterNumber}</p>
                <span className="absolute top-1 right-1 bg-gray-200 text-black px-2 py-1 rounded-md text-xs">
                  {t.status}
                </span>
              </>
            )}
          />

          {/* TV Subscription Transactions */}
          <Section
            title="TV Subscription Transactions"
            items={user.tvSubscriptionTransaction}
            renderItem={(t) => (
              <>
                <p>Amount: {formatToNaira(t.amount)}</p>
                <p>Provider: {t.provider}</p>
                <span className="absolute top-1 right-1 bg-gray-200 text-black px-2 py-1 rounded-md text-xs">
                  {t.status}
                </span>
              </>
            )}
          />

          {/* Payments */}
          <Section
            title="Deposit History"
            items={user.paymentHistory}
            renderItem={(t) => (
              <>
                <p>Amount: {formatToNaira(t.amount)}</p>
                <p>Type: {t.paymentType}</p>
                <span className="absolute top-1 right-1 bg-gray-200 text-black px-2 py-1 rounded-md text-xs">
                  {t.status}
                </span>
              </>
            )}
          />

          {/* Refunds */}
          <Section
            title="Refunds"
            items={user.refunds}
            renderItem={(t) => (
              <>
                <p>Amount: {formatToNaira(t.amount)}</p>
                <p>Reason: {t.reason}</p>
                <span className="absolute top-1 right-1 bg-gray-200 text-black px-2 py-1 rounded-md text-xs">
                  {t.status}
                </span>
              </>
            )}
          />
        </div>
      )}
    </Modal>
  );
};

const Section = ({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
}) => {
  const [showAll, setShowAll] = useState(false);

  const hasMore = items.length > 3;
  const visibleItems = showAll ? items : items.slice(0, 3);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {items.length === 0 ? (
        <div className="p-3 rounded-lg text-white relative bg-[#173842]">
          <p className="text-gray-300 italic">No {title.toLowerCase()} data</p>
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {visibleItems.map((item, i) => (
              <li
                key={i}
                className="p-3 rounded-lg text-white relative"
                style={{
                  background:
                    item?.status === "successful"
                      ? "#027112"
                      : item.status === "failed"
                      ? "#b30404"
                      : "#173842",
                }}
              >
                {renderItem(item, i)}
              </li>
            ))}
          </ul>
          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-2 text-blue-600 cursor-pointer hover:underline"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default UserModal;
