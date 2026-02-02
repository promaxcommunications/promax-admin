import { useState } from "react";
import { get, post } from ".";
import useUserStore from "@/store/user";
import { useRouter } from "next/router";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useLogin = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const disableSubmit = !(form.email && form.password);

  const handleSubmit = async () => {
    const isValidEmail = emailRegex.test(form.email);
    if (!isValidEmail) {
      setError("Invalid email");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");
    setIsLoading(true);

    const res = await post("/auth/login", {
      email: form.email.trim(),
      password: form.password.trim(),
    });

    setIsLoading(false);

    if (res.error) {
      setError(res.error || "Signup failed");
      console.log("server-error: ", res.error);
      return;
    }

    const { accessToken, refreshToken, ...userData } = res.data;
    if (userData.role === "USER") {
      setError("This is not an admin account");
      return;
    }

    localStorage.setItem("promax_accessToken", accessToken);
    localStorage.setItem("promax_refreshToken", refreshToken);

    setUser(userData);
    router.replace("/overview");
  };

  const autoLogin = async () => {
    // await new Promise((res) => setTimeout(res, 3000));
    const res = await get("/user/me");

    if (res.data) {
      // console.log(res.data);
      setUser(res.data);
    } else {
      router.push("/auth/login");
      console.log(res.error);
    }
  };

  return {
    error,
    setError,
    isLoading,
    handleSubmit,
    form,
    setForm,
    disableSubmit,
    autoLogin,
  };
};
