// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import * as AuthService from "../services/AuthService";

export interface User {
  avatar: { url: string; public_id?: string };
  id: string;
  name: string;
  email: string;
  role?: string; // "user" | "admin"
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean; // New: Computed role flag
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // New: Compute isAdmin
  const isAdmin = user?.role === "admin";

  // Load user from cookie (backend verifies)
  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await AuthService.getCurrentUser();

      if (res?.success) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await AuthService.login({ email, password });

    if (res.success) {
      await checkAuth(); // Re-fetch to update user/role
      return true;
    }
    return false;
  };

  // Logout
  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAdmin, // New: Expose computed flag
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
