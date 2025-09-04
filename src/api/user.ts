import { useEffect, useState } from "react";
import { get } from ".";

export const useGetUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUsers = async () => {
    setIsLoading(true);

    const res = await get("/admin/users");
    const { data } = res;

    if (data) {
      console.log(res.data[1]);
      setUsers(res.data);
    } else {
      console.log(res.error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return {
    users,
    getUsers,
    isLoading,
  };
};

export const useGetUser = () => {
  const [user, setUser] = useState(null as null | User);
  const [isLoading, setIsLoading] = useState(false);

  const getUser = async (userId: string) => {
    setIsLoading(true);

    const res = await get("/admin/user/" + userId);
    const { data } = res;

    if (data) {
      setUser(res.data);
    } else {
      console.log(res.error);
    }

    setIsLoading(false);
  };

  return {
    user,
    setUser,
    getUser,
    isLoading,
  };
};
