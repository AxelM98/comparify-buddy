
import React, { useEffect, useState } from "react";

const LoginButton = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://comparify-buddy.lovable.app/auth/user", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    window.location.href = "https://comparify-buddy.lovable.app/auth/google";
  };

  const handleLogout = () => {
    window.location.href = "https://comparify-buddy.lovable.app/auth/logout";
  };

  return (
    <div>
      {user ? (
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#DB4437",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Logga ut ({user.email})
        </button>
      ) : (
        <button
          onClick={handleLogin}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Logga in med Google
        </button>
      )}
    </div>
  );
};

export default LoginButton;
