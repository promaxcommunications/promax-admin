import { handleLogout } from "@/api";
import useUserStore from "@/store/user";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { user } = useUserStore();

  const logout = () => {
    handleLogout();
    router.push("/auth/login");
  };

  return (
    <header className="h-[88px] fixed left-[320px] top-0 right-0 px-5 bg-white flex justify-between items-center">
      <h2 className="text-2xl font-semibold capitalize">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="w-9 h-9 rounded-full grid place-content-center text-base font-bold bg-[#96D4FF]">
          {user?.firstName.slice(0, 1)}
          {user?.lastName.slice(0, 1)}
        </span>
        <h5 className="text-[#25272C]">
          {user?.firstName} {user?.lastName}
        </h5>
        <span className="px-4 py-2 text-sm rounded bg-[#173842] text-white">
          {user?.role}
        </span>

        <button
          onClick={logout}
          className="px-3 py-2 cursor-pointer rounded-sm  bg-[#32CD32]"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
