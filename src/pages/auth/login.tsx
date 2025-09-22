import { useLogin } from "@/api/auth";
import ImageEl from "@/components/image";
import { useState } from "react";

const Page = () => {
  const { disableSubmit, error, form, handleSubmit, isLoading, setForm } =
    useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-[#F7F7F7]">
      <div className="fixed top-0 left-0 w-full px-10 py-5">
        <ImageEl src="/images/logo.png" alt="logo" />
      </div>

      <div className="flex h-screen items-center justify-center">
        <div className="bg-[#173842] text-white rounded-lg p-10 w-[600px]">
          <h1 className="text-2xl font-bold text-center">
            Login to Admin Dashboard
          </h1>
          <form
            className="flex flex-col gap-2 mt-10"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="flex flex-col gap-2">
              <label className="font-medium text-lg" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="border border-gray-300 rounded-lg p-3 bg-white text-black w-full"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2 mt-5">
              <label className="font-medium text-lg" htmlFor="password">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="border border-gray-300 rounded-lg p-3 bg-white text-black w-full"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-black font-medium p-1 text-sm cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <p className="text-red-500 text-base font-medium mt-10 text-center">
              {error}
            </p>
            <button
              disabled={disableSubmit || isLoading}
              type="submit"
              className="px-6 py-4 w-full text-xl cursor-pointer font-bold rounded-lg text-[#173842] bg-[#32CD32]"
            >
              {isLoading ? <span className="loader-small"></span> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
