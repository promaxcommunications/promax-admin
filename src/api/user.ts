import { useEffect, useState, useCallback } from "react";
import { get } from ".";

type SortKey = "date" | "balance" | "role" | "referralPoints" | "lastActive";
type FilterKey = "all" | "verified" | "unverified";

export const useGetUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Controls
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState<string>("");

  const limit = 15;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    // Search
    if (search.trim()) params.set("search", search.trim());

    // Verified filter -> backend expects isEmailVerified=true/false
    if (filter === "verified") params.set("isEmailVerified", "true");
    if (filter === "unverified") params.set("isEmailVerified", "false");

    // Sorting: map UI keys to backend sortBy keys
    let sortBy = "dateJoined";
    switch (sort) {
      case "date":
        sortBy = "dateJoined";
        break;
      case "balance":
        sortBy = "walletBalance";
        break;
      case "role":
        sortBy = "role";
        break;
      case "referralPoints":
        sortBy = "referralPoints";
        break;
      case "lastActive":
        sortBy = "lastActive";
        break;
    }
    params.set("sortBy", sortBy);
    params.set("order", sortOrder);

    const res = await get(`/admin/users?${params.toString()}`);
    console.log(params.toString());

    // Expect backend to respond: { data: User[], meta: { total, page, limit, totalPages } }
    const { data } = res;

    if (data) {
      const { users, meta } = data;

      setUsers(users);
      if (meta) {
        setTotalPages(meta.totalPages ?? 1);
        setTotalCount(meta.total ?? meta.totalCount ?? 0);
      } else {
        // fallback: calculate pages from known totalCount if present
        setTotalPages(1);
      }
    } else {
      console.error("Failed to fetch users", res.error);
      setUsers([]);
      setTotalPages(1);
      setTotalCount(0);
    }
    setIsLoading(false);
  }, [page, filter, sort, sortOrder, search]);

  // fetch on dependency change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    page,
    totalPages,
    totalCount,
    limit,
    setPage,
    filter,
    setFilter,
    sort,
    setSort,
    sortOrder,
    setSortOrder,
    search,
    setSearch,
    refresh: fetchUsers,
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
