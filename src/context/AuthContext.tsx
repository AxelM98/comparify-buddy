import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

export interface User {
  _id: string;
  email: string;
  displayName?: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  photos?: { value: string }[];
  savedAnalyses?: any[];
}

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/user`, {
  credentials: "include",
});

      // Kontrollera att svaret är JSON
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Not JSON response");
      }

      const data = await res.json();
      if (data.user) {
        console.log("✅ USER FROM SERVER:", data.user);
        setUser(data.user);
      }
    } catch (err) {
      console.error("No user session", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
