import { create } from "zustand";

type User = {
  id: number;
  email: string;
  nickName: string;
  role: "user" | "admin";
};

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
