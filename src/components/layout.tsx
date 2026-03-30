import useUserStore from "@/store/user";
import Aside from "./aside";
import Header from "./header";
import ImageEl from "./image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore();

  if (user === null) {
    return (
      <div className="p-10">
        <ImageEl src="/images/logo1.png" alt="logo" />
        <div className="h-[85vh] flex justify-center items-center">
          <span className="loader"></span>
        </div>
      </div>
    );
  }

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
