import { Dispatch, SetStateAction } from "react";
import Modal from "./modal";
import { formatToNaira, parseDateTime } from "@/utils";

const DepositHistoryModal = ({
  transaction,
  setTransaction,
}: {
  transaction: PaymentHistory | null;
  setTransaction: Dispatch<SetStateAction<PaymentHistory | null>>;
}) => {
  if (!transaction) return null;

  const { date, time } = parseDateTime(transaction.createdAt);
  const isLoading = false;

  return (
    <Modal
      openModal={!!transaction}
      closeModal={() => setTransaction(null)}
      title={`Transaction - ${transaction.paymentType}`}
    >
      {isLoading ? (
        <div className="h-[80vh] grid place-content-center w-[600px]">
          <span className="loader"></span>
        </div>
      ) : !transaction ? (
        <div className="h-[80vh] grid place-content-center w-[600px]">
          <span className="text-gray-400 italic">
            No transaction data found
          </span>
        </div>
      ) : (
        <div className="px-10 mt-6 w-[600px] space-y-6 pb-20 leading-10">
          {/* User Info (Legacy Display) */}
          <section className="bg-[#173842] text-white rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold mb-2">User Info</h3>
            <p>
              <span className="font-medium text-[#21C239]">User:</span>{" "}
              {transaction.user.firstName} {transaction.user.lastName}
            </p>
            <p>
              <span className="font-medium text-[#21C239]">Email:</span>{" "}
              {transaction.user.email}
            </p>
          </section>

          <section className="bg-[#173842] text-white rounded-lg p-4 shadow relative">
            <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>

            <span className="absolute top-1 right-1 bg-gray-200 text-black px-2 py-1 rounded-md text-xs">
              {transaction.status}
            </span>
            <p>
              <span className="font-medium text-[#21C239]">ID:</span>{" "}
              {transaction.id}
            </p>
            <p>
              <span className="font-medium text-[#21C239]">Date:</span> {date}
            </p>
            <p>
              <span className="font-medium text-[#21C239]">Time:</span> {time}
            </p>
            {transaction.title && (
              <p>
                <span className="font-medium text-[#21C239]">Title:</span>{" "}
                {transaction.title}
              </p>
            )}
            <p>
              <span className="font-medium text-[#21C239]">Amount:</span>{" "}
              {formatToNaira(transaction.amount)}
            </p>

            <p>
              <span className="font-medium text-[#21C239]">Payment Type:</span>{" "}
              {transaction.paymentType}
            </p>
            <p>
              <span className="font-medium text-[#21C239]">Reference:</span>{" "}
              {transaction.reference || "N/A"}
            </p>
          </section>

          <section className="bg-[#173842] text-white rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold mb-2">Payment Metadata</h3>

            {transaction.metadata ? (
              <div className="pl-4">
                {Object.entries(transaction.metadata).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <p>
                      <span className="font-medium text-[#21C239]">{key}:</span>{" "}
                      {typeof value === "object" && value !== null
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </p>
                    {typeof value === "object" && value !== null && (
                      <div className="pl-4 text-sm text-gray-300">
                        <span className="font-medium text-[#21C239]">
                          Type:
                        </span>{" "}
                        object
                        <br />
                        <span className="font-medium text-[#21C239]">
                          Keys:
                        </span>{" "}
                        {Object.keys(value).join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No metadata available</p>
            )}
          </section>
        </div>
      )}
    </Modal>
  );
};

export default DepositHistoryModal;
