
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const data = await response.json();
        setUser(data.user ?? data);
      } catch (error) {
        console.error("Load user error:", error);
        setMessage("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        setMessage("ออกจากระบบไม่สำเร็จ กรุณาลองใหม่");
        return;
      }

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      setMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  if (loading) {
    return <div className="auth-box">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="auth-box">
        <p>{message || "ไม่พบข้อมูลผู้ใช้"}</p>
        <button onClick={() => router.push("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="auth-box">
      <h1>Dashboard</h1>

      <p>
        Welcome, {user.fullname || user.name || "User"}
      </p>

      <p>Email: {user.email}</p>

      {message && <p className="error">{message}</p>}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
