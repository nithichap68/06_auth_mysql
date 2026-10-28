
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, email, password }),
      });

      const raw = await response.text();

      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {
          message: raw || "เซิร์ฟเวอร์ไม่ได้ส่งข้อมูลกลับมา",
        };
      }

      if (!response.ok) {
        setMessage(
          data.message || `สมัครสมาชิกไม่สำเร็จ (${response.status})`
        );
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error("Register request error:", error);
      setMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-box">
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <input
          value={fullname}
          onChange={(event) => setFullname(event.target.value)}
          placeholder="Full name"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          minLength={6}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p className="error">{message}</p>}

      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
