import { create } from "zustand";

export const store = create((set) => ({
  isLogin: null,
  user: null,

  logged_user: (userData: any) => {
    set({
      user: userData,
      isLogin: true,
    });
  },

  loggedOut_user: () => {
    set({
      user: null,
      isLogin: false,
    });
  },
}));