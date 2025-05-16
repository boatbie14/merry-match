// pages/api/merry-limit.js
import { createClient } from "@supabase/supabase-js";

// ตั้งค่า Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ID ของ Free Package
const FREE_PACKAGE_ID = "6c3e5251-6ba4-4c79-a305-22cfaaecb47c";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // ใช้ user_id จาก query params
    const user_id = req.query.user_id;

    // ถ้าไม่มี user_id ให้ส่ง error กลับไป
    if (!user_id) {
      return res.status(400).json({
        error: "User ID is required",
        count: 0,
        merry_per_day: 10,
      });
    }

    // รับวันที่จาก client หรือใช้วันที่ปัจจุบัน
    let clientDate;
    let todayYMD;

    if (req.query.date) {
      // ถ้า client ส่งวันที่มา ใช้วันที่นั้น
      clientDate = new Date(req.query.date);
      todayYMD = clientDate.toISOString().split("T")[0];
    } else {
      // ถ้า client ไม่ได้ส่งวันที่มา ใช้วันที่ของ server แต่ปรับตาม timezone ของไทย (UTC+7)
      clientDate = new Date();
      // ปรับ timezone เป็นของไทย (UTC+7)
      clientDate.setHours(clientDate.getHours() + 7);
      todayYMD = clientDate.toISOString().split("T")[0];
    }

    // 1. เช็คว่า user มี package active อยู่หรือไม่
    const { data: activePackage, error: packageError } = await supabase
      .from("user_packages")
      .select("*, packages(*)")
      .eq("user_id", user_id)
      .eq("package_status", "active")
      .single();

    if (packageError && packageError.code !== "PGRST116") {
      throw new Error(packageError.message);
    }

    // กำหนดค่า package ที่ใช้งาน (active หรือ free)
    let packageInfo;
    let user_package_id;

    if (activePackage) {
      packageInfo = activePackage.packages;
      user_package_id = activePackage.id;
    } else {
      // ถ้าไม่มี package active ให้ดึงข้อมูล Free Package จากฐานข้อมูล
      const { data: freePackage, error: freePackageError } = await supabase.from("packages").select("*").eq("id", FREE_PACKAGE_ID).single();

      if (freePackageError) {
        throw new Error(`ไม่พบข้อมูล Free Package: ${freePackageError.message}`);
      }

      packageInfo = freePackage;

      // คำนวณ end_date สำหรับ Free Package (วันนี้ + duration_days)
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(now.getDate() + freePackage.duration_days);

      // สร้าง user_packages สำหรับ Free Package
      const { data: newUserPackage, error: createUserPackageError } = await supabase
        .from("user_packages")
        .insert({
          user_id: user_id,
          package_id: FREE_PACKAGE_ID,
          start_date: now.toISOString(),
          end_date: endDate.toISOString(),
          package_status: "active",
        })
        .select()
        .single();

      if (createUserPackageError) {
        throw new Error(`ไม่สามารถสร้าง user_packages สำหรับ Free Package: ${createUserPackageError.message}`);
      }

      user_package_id = newUserPackage.id;
    }

    // 2. เช็คว่ามี merry_count_log ของวันนี้หรือไม่
    const { data: merryLog, error: logError } = await supabase
      .from("merry_count_log")
      .select("*")
      .eq("user_id", user_id)
      .eq("log_date", todayYMD)
      .single();

    if (logError && logError.code !== "PGRST116") {
      throw new Error(logError.message);
    }

    let merryCount;

    // 3. ถ้าไม่มี log วันนี้ ให้สร้างใหม่
    if (!merryLog) {
      const now = new Date();
      const { data: newLog, error: createError } = await supabase
        .from("merry_count_log")
        .insert({
          user_id: user_id,
          user_package_id: user_package_id,
          log_date: todayYMD,
          count: 0,
          created_at: now.toISOString(),
        })
        .select()
        .single();

      if (createError) {
        throw new Error(createError.message);
      }

      merryCount = newLog.count;
    } else {
      merryCount = merryLog.count;
    }

    // 4. Return ข้อมูลตามที่ต้องการ
    return res.status(200).json({
      user_id: user_id,
      package_name: packageInfo.package_name,
      count: merryCount,
      merry_per_day: packageInfo.merry_per_day,
      log_date: todayYMD, // ส่งกลับเป็นรูปแบบ YYYY-MM-DD
    });
  } catch (error) {
    console.error("Error checking merry limit:", error);
    return res.status(500).json({
      error: error.message,
      count: 0, // ส่งค่าเริ่มต้นกลับไปเมื่อเกิดข้อผิดพลาด
      merry_per_day: 10, // ส่งค่าเริ่มต้นกลับไปเมื่อเกิดข้อผิดพลาด
    });
  }
}
