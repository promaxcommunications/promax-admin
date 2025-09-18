import { Dispatch, SetStateAction, useEffect } from "react";
import Modal from "./modal";
import { formatToNaira, parseDateTime } from "@/utils";
import { useGetTransaction } from "@/api/user";

const TransactionModal = ({
  transactionSelected,
  setTransactionSelected,
  service,
}: {
  transactionSelected: BaseTransaction | null;
  setTransactionSelected: Dispatch<SetStateAction<BaseTransaction | null>>;
  service: string;
}) => {
  const { transaction, setTransaction, getTransaction, isLoading } =
    useGetTransaction();

  useEffect(() => {
    if (!transactionSelected) return;
    getTransaction(transactionSelected?.id, service);
    return () => setTransaction(null);
  }, [transactionSelected, service]);

  if (!transactionSelected) return null;

  const { date, time } = parseDateTime(transactionSelected.createdAt);

  return (
    <Modal
      openModal={!!transactionSelected}
      closeModal={() => setTransactionSelected(null)}
      title={`Transaction - ${service.toUpperCase()}`}
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
          {/* User Info */}
          <section className="bg-[#173842] text-white rounded-lg p-4 shadow">
            <p>
              <span className="font-medium text-[#21C239]">User:</span>{" "}
              {transaction.user.firstName} {transaction.user.lastName}
            </p>
            <p>
              <span className="font-medium text-[#21C239]">Email:</span>{" "}
              {transaction.user.email}
            </p>
            <p>
              <span className="font-medium text-[#21C239]">Date:</span> {date}
            </p>
            <p>
              <span className="font-medium text-[#21C239]">Time:</span> {time}
            </p>
            <p>
              <span className="font-medium text-[#21C239]">Status:</span>{" "}
              {transaction.status}
            </p>
          </section>

          {transaction && (
            <section className="bg-[#173842] text-white rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold mb-2">
                Transaction Details
              </h3>

              <p>
                <span className="font-medium text-[#21C239]">ID:</span>{" "}
                {transaction.transactionId}
              </p>
              <p>
                <span className="font-medium text-[#21C239]">Amount:</span>{" "}
                {formatToNaira(transaction.amount)}
              </p>

              {/* Service-specific fields */}
              {transaction.type === "airtime" && (
                <>
                  <p>
                    <span className="font-medium text-[#21C239]">Network:</span>{" "}
                    {transaction.network}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">Phone:</span>{" "}
                    {transaction.phoneNumber}
                  </p>
                </>
              )}

              {transaction.type === "data" && (
                <>
                  <p>
                    <span className="font-medium text-[#21C239]">Network:</span>{" "}
                    {transaction.network}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">Plan:</span>{" "}
                    {transaction.plan}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">Phone:</span>{" "}
                    {transaction.phoneNumber}
                  </p>
                  {transaction.packageName && (
                    <p>
                      <span className="font-medium text-[#21C239]">
                        Package Name:
                      </span>{" "}
                      {transaction.packageName}
                    </p>
                  )}
                </>
              )}

              {transaction.type === "betting" && (
                <>
                  <p>
                    <span className="font-medium text-[#21C239]">
                      Platform:
                    </span>{" "}
                    {transaction.bettingPlatform}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">Account:</span>{" "}
                    {transaction.accountNumber}
                  </p>
                </>
              )}

              {transaction.type === "examPin" && (
                <>
                  <p>
                    <span className="font-medium text-[#21C239]">
                      Exam Type:
                    </span>{" "}
                    {transaction.examType}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">
                      Phone Number:
                    </span>{" "}
                    {transaction.phoneNumber || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">Pin:</span>{" "}
                    {transaction.pin || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">
                      Serial No:
                    </span>{" "}
                    {transaction.serialNumber || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">Token:</span>{" "}
                    {transaction.Token || "N/A"}
                  </p>
                </>
              )}

              {transaction.type === "electricity" && (
                <>
                  <p>
                    <span className="font-medium text-[#21C239]">
                      Provider:
                    </span>{" "}
                    {transaction.provider}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">Meter:</span>{" "}
                    {transaction.meterNumber}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">
                      Meter Type:
                    </span>{" "}
                    {transaction.meterType}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">Units:</span>{" "}
                    {transaction.units || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">Token:</span>{" "}
                    {transaction.token || "N/A"}
                  </p>
                </>
              )}

              {transaction.type === "tv" && (
                <>
                  <p>
                    <span className="font-medium text-[#21C239]">
                      Provider:
                    </span>{" "}
                    {transaction.provider}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">
                      Smartcard:
                    </span>{" "}
                    {transaction.smartcardNumber}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">Package:</span>{" "}
                    {transaction.package}
                  </p>
                  <p>
                    <span className="font-medium text-[#21C239]">Renewal:</span>{" "}
                    {transaction.isRenewal ? "Yes" : "No"}
                  </p>
                </>
              )}
            </section>
          )}
        </div>
      )}
    </Modal>
  );
};

export default TransactionModal;
