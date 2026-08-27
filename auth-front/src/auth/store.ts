import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type User from "@/models/User";
import { loginUser, logoutUser, refreshToken } from "@/services/AuthService";
import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  authStatus: boolean;
  authLoading: boolean;
  login: (data: LoginData) => Promise<LoginResponseData>;
  hydrate: () => Promise<boolean>;
  logout: () => Promise<void>;
  setSession: (accessToken: string, user: User) => void;
  clearSession: () => void;
  checkLogin: () => boolean;
};

const useAuth = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  authStatus: false,
  authLoading: true,

  setSession: (accessToken, user) => {
    set({ accessToken, user, authStatus: true });
  },

  clearSession: () => {
    set({ accessToken: null, user: null, authStatus: false });
  },

  login: async (data) => {
    set({ authLoading: true });
    try {
      const result = await loginUser(data);
      set({
        accessToken: result.accessToken,
        user: result.user,
        authStatus: true,
      });
      return result;
    } finally {
      set({ authLoading: false });
    }
  },

  hydrate: async () => {
    try {
      const result = await refreshToken();
      set({
        accessToken: result.accessToken,
        user: result.user,
        authStatus: true,
        authLoading: false,
      });
      return true;
    } catch {
      set({
        accessToken: null,
        user: null,
        authStatus: false,
        authLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ authLoading: true });
    try {
      await logoutUser();
    } catch {
      // Local session is still cleared if the server cannot be reached.
    } finally {
      set({
        accessToken: null,
        user: null,
        authStatus: false,
        authLoading: false,
      });
    }
  },

  checkLogin: () => Boolean(get().authStatus && get().accessToken),
}));

export default useAuth;
