import { navLinks } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Aside = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <aside className="w-[320px] h-screen fixed left-0 top-0 bg-white py-8">
      <Image
        src="/images/logo1.png"
        alt="logo"
        width={0}
        height={0}
        sizes="100vw"
        className="w-auto h-[60px] mx-auto"
      />

      <div className="mt-20 flex flex-col gap-2 h-full pb-40 overflow-y-scroll">
        {navLinks.map((link, index) => (
          <Link
            href={"/" + link.href}
            key={index}
            className={
              "w-full flex py-5 pl-16 items-center font-medium cursor-pointer gap-2 " +
              (currentPath.includes(link.href)
                ? "bg-[#68B9CE] text-[#FEFEFE]"
                : "text-black")
            }
          >
            <link.icon isActive={currentPath.includes(link.href)} />
            {link.title}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Aside;
