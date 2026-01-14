import Aside from "./aside";
import Header from "./header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Aside />
      <Header />

      <div className="py-[108px] pl-[340px] pr-5 w-full min-h-screen">
        {children}
      </div>
    </>
  );
};

export default Layout;
