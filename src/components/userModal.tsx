import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "./modal";
import { formatDate, formatToNaira } from "@/utils";
import { useGetUser } from "@/api/user";
import useUserStore from "@/store/user";

const UserModal = ({
  userSelected,
  setUserSelected,
  setUsers,
}: {
  userSelected: User | null;
  setUserSelected: Dispatch<SetStateAction<User | null>>;
  setUsers: Dispatch<SetStateAction<User[]>>;
}) => {
  const { user: loggedInUser } = useUserStore();
  const {
    getUser,
    isLoading,
    user,
    setUser,
    handleDisableUser,
    handleMakeUserAdmin,
  } = useGetUser({ updateLocalUserList: setUsers });
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  useEffect(() => {
    if (!userSelected) return;
    getUser(userSelected?.id);
    return () => setUser(null);
  }, [userSelected]);

  if (!userSelected) return null;

  const title = `${userSelected.firstName} ${userSelected.lastName}`;

  const handleConfirm = async () => {
    if (confirmAction === "deactivate") await handleDisableUser();
    else if (confirmAction === "admin") await handleMakeUserAdmin();
    setConfirmAction(null);
  };

  const confirmMessage =
    confirmAction === "deactivate"
      ? user
        ? user.isActive
          ? "Are you sure you want to deactivate this user's account?"
          : "Are you sure you want to activate this user's account?"
        : ""
      : confirmAction === "admin"
        ? user
          ? user.role === "USER"
            ? "Are you sure you want to make this user an admin?"
            : "Are you sure you want to remove this user as admin?"
          : ""
        : "";

  return (
    <Modal
      openModal={!!userSelected}
      closeModal={() => setUserSelected(null)}
      title={title}
    >
      <ConfirmModal
        action={confirmAction}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
        isLoading={isLoading}
      />
      {isLoading && !confirmAction ? (
        <div className="h-[80vh] max-h-[500px] grid place-content-center w-[600px]">
          <span className="loader" />
        </div>
      ) : !user ? (
        <div className="h-[80vh] max-h-[500px] grid place-content-center w-[600px]">
          <span className="text-gray-400 italic">
            There is a problem fetching the user
          </span>
        </div>
      ) : (
        <div className="px-10 mt-6 w-[600px] space-y-6 pb-20">
          {/* Action Buttons */}
          {user.role !== "SUPER_ADMIN" && (
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction("deactivate")}
                className={`py-2 px-4 rounded-lg text-white font-medium transition-colors cursor-pointer ${
                  user.isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {user.isActive ? "Deactivate Account" : "Activate Account"}
              </button>
              {loggedInUser?.role === "SUPER_ADMIN" && (
                <button
                  onClick={() => setConfirmAction("admin")}
                  className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors cursor-pointer"
                >
                  {user.role === "USER" ? "Make Admin" : "Remove Admin"}
                </button>
              )}
            </div>
          )}

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
                <span className="font-medium">Status:</span>{" "}
                {user.isActive ? "✅ Active" : "❌ Deactivated"}
              </p>
              <p>
                <span className="font-medium">Email Verified:</span>{" "}
                {user.isEmailVerified ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <span className="font-medium">Joined:</span>{" "}
                {formatDate(userSelected.createdAt)}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span>{" "}
                {formatDate(userSelected.updatedAt)}
              </p>
            </div>
          </section>

          {/* Delete Info */}
          {userSelected.deletedAt && (
            <>
              <h3 className="font-semibold text-lg mb-0">Delete Info</h3>
              <section className="bg-red-800 text-white rounded-lg p-4 shadow">
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">is Account Deleted:</span>
                    {user.isDeleted ? "✅ Yes" : "❌ No"}
                  </p>
                  <p>
                    <span className="font-medium">Last deleted time:</span>{" "}
                    {formatDate(userSelected.deletedAt)}
                  </p>
                  <p>
                    <span className="font-medium">Reason:</span>{" "}
                    {user.deleteReason}
                  </p>
                </div>
              </section>
            </>
          )}

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

          {/* Transactions */}
          <h3 className="font-semibold text-lg mb-0">Transactions</h3>
          <section className="bg-[#173842] text-white rounded-lg p-4 shadow">
            <ul className="space-y-1">
              <li>Airtime: {user.airtimeTransactions.length}</li>
              <li>Data: {user.dataTransactions.length}</li>
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
                <p>Network: {t.network}</p>
                <p>Date: {formatDate(t.createdAt)}</p>
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
                <p>Network: {t.network}</p>
                <p>Date: {formatDate(t.createdAt)}</p>
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
                <p>Pin: {t.pin}</p>
                <p>Serial Number: {t.serialNumber}</p>
                <p>Date: {formatDate(t.createdAt)}</p>
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
                <p>Meter Type: {t.meterType}</p>
                <p>Provider: {t.provider}</p>
                <p>Units: {t.units}</p>
                <p>Token: {t.token}</p>
                <p>Date: {formatDate(t.createdAt)}</p>
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
                <p>Smart Card Number: {t.smartcardNumber}</p>
                <p>Package: {t.package}</p>
                <p>Date: {formatDate(t.createdAt)}</p>
                <span className="absolute top-1 right-1 bg-gray-200 text-black px-2 py-1 rounded-md text-xs">
                  {t.status}
                </span>
              </>
            )}
          />

          {/* Deposit History */}
          <Section
            title="Deposit History"
            items={user.paymentHistory}
            renderItem={(t) => (
              <>
                <p>Amount: {formatToNaira(t.amount)}</p>
                <p>Type: {t.paymentType}</p>
                <p>Title: {t.title}</p>
                <p>Date: {formatDate(t.createdAt)}</p>
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
                <p>Type: {t.transactionType}</p>
                <p>Date: {formatDate(t.createdAt)}</p>
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

type ConfirmAction = "deactivate" | "admin" | null;

const ConfirmModal = ({
  action,
  message,
  onConfirm,
  onCancel,
  isLoading,
}: {
  action: ConfirmAction;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  if (!action) return null;

  const isDeactivate = action === "deactivate";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white text-black rounded-xl p-10 w-[400px] shadow-xl space-y-4">
        <p className="text-lg text-center">{message}</p>
        <div className="flex gap-3 mt-10">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-500 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2 rounded-lg text-white font-medium transition-colors cursor-pointer disabled:opacity-60 ${
              isDeactivate
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? <span className="loader-small" /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
