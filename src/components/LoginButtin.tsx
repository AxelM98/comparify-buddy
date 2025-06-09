
import React, { useEffect, useState } from "react";

const LoginButton = () => {
  const [user, setUser] = useState(null);
  const BACKEND_URL = "https://comparify-buddy.lovable.app";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🔍 LoginButton checking auth...");
        
        const res = await fetch(`${BACKEND_URL}/auth/user`, {
          credentials: "include",
          mode: "cors",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        });
        
        console.log("📡 LoginButton auth response:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
          console.log("✅ LoginButton user:", data.user);
        } else {
          setUser(null);
          console.log("❌ LoginButton auth failed:", res.status);
        }
      } catch (err) {
        console.error("❌ LoginButton auth check failed", err);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    console.log("🔗 Redirecting to Google login...");
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const handleLogout = () => {
    console.log("🔗 Redirecting to logout...");
    window.location.href = `${BACKEND_URL}/auth/logout`;
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
