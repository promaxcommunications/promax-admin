import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import Modal from "@/components/modal";
import { useCustomerSupport, useBroadcastPush } from "@/api/user";

type BroadcastResult = {
  userCount: number;
  deviceCount: number;
  chunkCount: number;
  ticketsOk: number;
  ticketsError: number;
  removedInvalidDevices: number;
};

const Page = () => {
  const {
    customerSupport,
    fetchCustomerSupport,
    isLoading,
    updateCustomerSupport,
  } = useCustomerSupport();
  const { broadcastPush, isLoading: isBroadcasting } = useBroadcastPush();

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const [openBroadcastModal, setOpenBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastResult, setBroadcastResult] =
    useState<BroadcastResult | null>(null);

  const handleBroadcast = async () => {
    const result = await broadcastPush(broadcastTitle, broadcastMessage);
    if (result) {
      setOpenBroadcastModal(false);
      setBroadcastTitle("");
      setBroadcastMessage("");
      setBroadcastResult(result);
    }
  };

  useEffect(() => {
    fetchCustomerSupport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (customerSupport) {
      setEmail(customerSupport.email);
      setPhoneNo(customerSupport.phoneNo);
    }
  }, [customerSupport]);

  const handleSave = async () => {
    await updateCustomerSupport({ email, phoneNo });
    setOpenModal(false);
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold">Customer Support</h1>
        <p className="mt-2 text-gray-500">Manage how customers can reach you</p>
      </div>

      <div className="mt-10">
        {isLoading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : (
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-7 max-w-md transition hover:shadow-lg">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Customer Support
              </h3>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {customerSupport?.email || "Not set"}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Phone & WhatsApp
                  </p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {customerSupport?.phoneNo || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => setOpenModal(true)}
                className="w-full py-3.5 rounded-xl bg-[#173842] text-white font-semibold text-sm transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
              >
                Edit Contact Details
              </button>

              <button
                onClick={() => setOpenBroadcastModal(true)}
                className="w-full py-3.5 rounded-xl bg-gray-50 text-gray-800 font-semibold text-sm border border-gray-200 transition hover:bg-gray-100 active:scale-[0.98] cursor-pointer"
              >
                Send Push Notification
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Broadcast Push Modal */}
      <Modal
        openModal={openBroadcastModal}
        closeModal={() => setOpenBroadcastModal(false)}
        title="Send Push Notification"
      >
        <div className="px-8 py-6 space-y-5 w-[420px]">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              className="px-4 py-4 bg-white rounded-lg mt-2 block w-full border border-gray-300 font-medium"
              placeholder="Notification title"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              rows={4}
              className="px-4 py-4 bg-white rounded-lg mt-2 block w-full border border-gray-300 font-medium resize-none"
              placeholder="Notification message"
            />
          </div>
          <button
            type="button"
            className="px-6 py-4 w-full text-xl cursor-pointer font-bold mt-4 rounded-lg bg-[#173842] text-yellow-400 disabled:opacity-60"
            disabled={
              isBroadcasting ||
              !broadcastTitle.trim() ||
              !broadcastMessage.trim()
            }
            onClick={handleBroadcast}
          >
            {isBroadcasting ? <span className="loader-small" /> : "Send"}
          </button>
        </div>
      </Modal>

      {/* Broadcast Result Modal */}
      {broadcastResult && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setBroadcastResult(null)}
          />
          <div className="relative bg-white text-black rounded-xl p-10 w-[420px] shadow-xl space-y-4">
            <p className="text-lg font-semibold text-center">Broadcast Sent</p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Users reached:</span>{" "}
                {broadcastResult.userCount}
              </p>
              <p>
                <span className="font-medium">Devices targeted:</span>{" "}
                {broadcastResult.deviceCount}
              </p>
              {/* <p>
                <span className="font-medium">Chunks sent:</span>{" "}
                {broadcastResult.chunkCount}
              </p> */}
              <p>
                <span className="font-medium">Tickets OK:</span>{" "}
                {broadcastResult.ticketsOk}
              </p>
              <p>
                <span className="font-medium">Tickets with errors:</span>{" "}
                {broadcastResult.ticketsError}
              </p>
              <p>
                <span className="font-medium">Invalid devices removed:</span>{" "}
                {broadcastResult.removedInvalidDevices}
              </p>
            </div>
            <button
              onClick={() => setBroadcastResult(null)}
              className="w-full py-2 mt-4 rounded-lg bg-[#173842] text-white font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Modal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        title="Edit Customer Support"
      >
        <div className="px-8 py-6 space-y-5 w-[420px]">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-4 bg-white rounded-lg mt-2 block w-full border border-gray-300 font-medium"
              placeholder="support@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="px-4 py-4 bg-white rounded-lg mt-2 block w-full border border-gray-300 font-medium"
              placeholder="+234 000 000 0000"
            />
          </div>

          <button
            type="button"
            className="px-6 py-4 w-full text-xl cursor-pointer font-bold mt-10 rounded-lg bg-[#173842] text-[#32CD32]"
            disabled={isLoading}
            onClick={handleSave}
          >
            {isLoading ? (
              <span className="loader-small"></span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </Modal>
    </Layout>
  );
};

export default Page;
