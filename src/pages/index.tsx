import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/overview");
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Hola</h1>
    </div>
  );
}
