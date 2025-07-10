const Header = () => {
  return (
    <header className="h-[88px] fixed left-[320px] top-0 right-0 px-5 bg-white flex justify-between items-center">
      <h2 className="text-2xl font-semibold capitalize">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="w-7 h-7 rounded-full grid place-content-center text-sm font-bold bg-[#96D4FF]">
          JY
        </span>
        <h5 className="text-[#25272C]">Joseph Yakubu</h5>
        <span className="px-4 py-2 text-sm rounded bg-[#173842] text-white">
          Super Admin
        </span>
      </div>
    </header>
  );
};

export default Header;
