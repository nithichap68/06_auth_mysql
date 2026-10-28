
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";

// POST /api/register
export async function POST(request) {
  try {
    const { email, password, fullname } = await request.json();

    if (!email || !password || !fullname) {
      return NextResponse.json(
        {
          status: "error",
          message: "กรุณากรอกชื่อ อีเมล และรหัสผ่านให้ครบ",
        },
        { status: 400 }
      );
    }

    // ตรวจสอบอีเมลซ้ำ
    const [rows] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "อีเมลนี้สมัครสมาชิกแล้ว",
        },
        { status: 409 }
      );
    }

    // เข้ารหัสรหัสผ่านก่อนบันทึก
    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (email, password, fullname) VALUES (?, ?, ?)",
      [email, hash, fullname]
    );

    return NextResponse.json(
      {
        status: "ok",
        id: result.insertId,
        message: "สมัครสมาชิกสำเร็จ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาตรวจสอบเซิร์ฟเวอร์",
      },
      { status: 500 }
    );
  }
}
