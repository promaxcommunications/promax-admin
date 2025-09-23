import { useEffect, useState, useCallback } from "react";
import { get } from ".";
import { formatNetworks } from "@/utils";

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

  const limit = 20;

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

export const useGetOverview = () => {
  const [overview, setOverview] = useState(null as null | OverviewType);
  const [isLoading, setIsLoading] = useState(false);

  const getOverview = async () => {
    setIsLoading(true);

    const res = await get("/admin/overview");
    const { data } = res;

    if (data) {
      setOverview(res.data);
    } else {
      console.log(res.error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getOverview();
  }, []);

  return {
    overview,
    setOverview,
    getOverview,
    isLoading,
  };
};

export const useGetTransactions = () => {
  type TranactionSortKey = "date" | "amount";
  type ServiceFilter =
    | "airtime"
    | "data"
    | "betting"
    | "electricity"
    | "tv"
    | "examPin";
  type StatusFilter = "all" | "SUCCESS" | "FAILED" | "PENDING";

  const [transactions, setTransactions] = useState<BaseTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Controls
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<TranactionSortKey>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [service, setService] = useState<ServiceFilter>("airtime");
  const [status, setStatus] = useState<StatusFilter>("all");

  const limit = 20;

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    if (search.trim()) params.set("search", search.trim());
    params.set("type", service);
    if (status !== "all") params.set("status", status);

    params.set("sortBy", sort === "amount" ? "amount" : "date");
    params.set("sortOrder", sortOrder);

    const query = `/admin/transactions?${params.toString()}`;
    console.log(query);

    // await new Promise((r) => setTimeout(r, 5000));
    const res = await get(query);
    const { data } = res;

    if (data) {
      const { transactions, totalCount, totalPages } = data;
      setTransactions(transactions);
      setTotalPages(totalPages ?? 1);
      setTotalCount(totalCount ?? 0);
    } else {
      setTransactions([]);
      setTotalPages(1);
      setTotalCount(0);
      console.error("Failed to fetch transactions", res.error);
    }

    setIsLoading(false);
  }, [page, search, service, status, sort, sortOrder]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    page,
    setPage,
    totalPages,
    totalCount,
    limit,
    search,
    setSearch,
    sort,
    setSort,
    sortOrder,
    setSortOrder,
    service,
    setService,
    status,
    setStatus,
    refresh: fetchTransactions,
  };
};

export const useGetPaymentHistory = () => {
  type TranactionSortKey = "date" | "amount";

  type StatusFilter = "all" | "COMPLETED" | "FAILED" | "PENDING";

  const [transactions, setTransactions] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Controls
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<TranactionSortKey>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [status, setStatus] = useState<StatusFilter>("all");

  const limit = 20;

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    if (search.trim()) params.set("search", search.trim());
    if (status !== "all") params.set("status", status);

    params.set("sortBy", sort === "amount" ? "amount" : "date");
    params.set("sortOrder", sortOrder);

    const query = `/admin/payment?${params.toString()}`;
    console.log(query);

    // await new Promise((r) => setTimeout(r, 5000));
    const res = await get(query);
    const { data } = res;

    if (data) {
      const { paymentHistory, totalCount, totalPages } = data;
      setTransactions(paymentHistory);
      setTotalPages(totalPages ?? 1);
      setTotalCount(totalCount ?? 0);
    } else {
      setTransactions([]);
      setTotalPages(1);
      setTotalCount(0);
      console.error("Failed to fetch transactions", res.error);
    }

    setIsLoading(false);
  }, [page, search, status, sort, sortOrder]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    page,
    setPage,
    totalPages,
    totalCount,
    limit,
    search,
    setSearch,
    sort,
    setSort,
    sortOrder,
    setSortOrder,
    status,
    setStatus,
    refresh: fetchTransactions,
  };
};

export const useGetTransaction = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTransaction = async (transactionId: string, type: string) => {
    setIsLoading(true);

    try {
      const res = await get(
        `/admin/transaction?id=${transactionId}&type=${type}`
      );
      const { data } = res;

      if (data) {
        // Add discriminant based on type
        const typedTransaction: Transaction = {
          ...data,
          type, // ← important, add type discriminator
        };
        setTransaction(typedTransaction);
      } else {
        console.log(res.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transaction,
    setTransaction,
    getTransaction,
    isLoading,
  };
};

export const useGetPlans = () => {
  const filters = [
    {
      title: "Data",
      query: "/data/get-data-variations",
      category: ["MTN", "GLO", "AIRTEL", "9MOBILE"],
    },
    {
      title: "Cable TV",
      query: "/tv/get-tv-packages",
      category: ["dstv", "gotv", "showmax", "startimes"],
    },
    {
      title: "Exam Pin",
      query: "/exam-pin/variations",
      category: ["JAMB", "WAEC"],
    },
  ];

  const [variation, setVariation] = useState<Record<string, any[]>>({});
  const [data, setData] = useState<Variation[]>([]);
  const [filterSelected, setFilterSelected] = useState(filters[0]);
  const [categorySelected, setCategorySelected] = useState(
    filters[0].category[0]
  );

  const [isLoading, setIsLoading] = useState(false);

  const getPlans = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await get(filterSelected.query);
      let { data } = res;

      if (data) {
        if (filterSelected.title === "Data") {
          data = formatNetworks(data);
        }

        setVariation(data);
        setData(variation[categorySelected] || []);
      } else {
        console.log(res.error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filterSelected]);

  useEffect(() => {
    getPlans();
    // Reset to first category when filter changes
    setCategorySelected(filterSelected.category[0]);
  }, [filterSelected, getPlans]);

  useEffect(() => {
    setData(variation[categorySelected] || []);
  }, [categorySelected, variation]);

  return {
    filterSelected,
    setFilterSelected,
    categorySelected,
    setCategorySelected,
    getPlans,
    data,
    isLoading,
    filters,
  };
};

export const useGetVariations = () => {
  const variationfilters = [
    {
      title: "Data",
      query: "data",
      category: ["MTN", "GLO", "AIRTEL", "9MOBILE"],
    },
    {
      title: "Cable TV",
      query: "tv",
      category: ["dstv", "gotv", "showmax", "startimes"],
    },
    {
      title: "Exam Pin",
      query: "exam",
      category: ["JAMB", "WAEC"],
    },
  ];

  const [variation, setVariation] = useState<Variation[]>([]);
  const [data, setData] = useState<Variation[]>([]);
  const [filterSelected, setFilterSelected] = useState(variationfilters[0]);
  const [categorySelected, setCategorySelected] = useState(
    variationfilters[0].category[0]
  );

  const [isLoading, setIsLoading] = useState(false);

  const getVariations = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await get(`/admin/variations/${filterSelected.query}`);
      let { data } = res;

      if (data) {
        data = data.variations;

        setVariation(data);

        const categoryVariation =
          data.filter(
            (data: any) =>
              data.provider.toLowerCase() === categorySelected.toLowerCase()
          ) || [];
        setData(categoryVariation);
      } else {
        console.log(res.error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filterSelected]);

  useEffect(() => {
    getVariations();
    // Reset to first category when filter changes
    setCategorySelected(filterSelected.category[0]);
  }, [filterSelected, getVariations]);

  useEffect(() => {
    let category = "";
    if (categorySelected === "9MOBILE") {
      category = "NINE_MOBILE";
    } else {
      category = categorySelected;
    }

    const categoryVariation =
      variation.filter(
        (data) => data.provider?.toLowerCase() === category.toLowerCase()
      ) || [];
    setData(categoryVariation);
  }, [categorySelected, variation]);

  return {
    filterSelected,
    setFilterSelected,
    categorySelected,
    setCategorySelected,
    getVariations,
    data,
    isLoading,
    filters: variationfilters,
    setData,
    setVariation,
  };
};

export const useGetMarkup = () => {
  const [data, setData] = useState<Markup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    setIsLoading(true);

    try {
      const res = await get(`/admin/markups`);
      const { data } = res;

      if (data) {
        setData(data);
      } else {
        console.log(res.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return {
    data,
    setData,
    getData,
    isLoading,
  };
};
