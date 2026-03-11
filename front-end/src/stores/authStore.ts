import { create } from "zustand";

// Define the state interface
interface AuthState {
  accessToken: string | null;
  user: {
      id: string,
      name: string,
      email: string,
      phone: string,
      role: string
  } | null
  login: (data: {
    accessToken: string
    user: {
      id: string,
      name: string,
      email: string,
      phone: string,
      role: string
  }}) => void;

  logout: () => void;
}

// Create the store
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  login: (data) => set({accessToken : data.accessToken, user: data.user}),
  logout: () => set({ accessToken: null, user: null }),
}));