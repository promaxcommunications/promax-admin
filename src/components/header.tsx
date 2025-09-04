import useUserStore from "@/store/user";

const Header = () => {
  const { user } = useUserStore();

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
      </div>
    </header>
  );
};

export default Header;
