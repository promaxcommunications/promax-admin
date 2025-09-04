import { create } from "zustand";
import { combine } from "zustand/middleware";

const useUserStore = create(
  combine(
    {
      user: null as User | null | undefined,
    },
    (set) => ({
      setUser: async (value: User | null | undefined) => {
        set({ user: value });
      },
    })
  )
);

export default useUserStore;
