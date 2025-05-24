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
    console.log("user_id = " + user_id);

    // ดึงข้อมูลจาก query params
    const todayFromUser = req.query.today; // ตัวอย่าง 2025-06-02
    const timezoneOffset = parseInt(req.query.timezone_offset || "0"); // ตัวอย่าง -420

    // ถ้าไม่มี user_id ให้ส่ง error กลับไป
    if (!user_id) {
      return res.status(400).json({
        error: "User ID is required",
        count: 0,
        merry_per_day: 10,
      });
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

    // 2. ดึง merry_count_log ล่าสุดของ user นี้
    const { data: latestLog, error: latestLogError } = await supabase
      .from("merry_count_log")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let createNewLog = true;
    let merryCount = packageInfo.merry_per_day;

    if (latestLog && !latestLogError) {
      // แปลง created_at (server time) เป็น user timezone
      const serverTime = new Date(latestLog.created_at);
      // แปลงเป็น user timezone (timezoneOffset เป็นนาที)
      const userTime = new Date(serverTime.getTime() - timezoneOffset * 60 * 1000);
      const userDateYMD = userTime.toISOString().split("T")[0];

      // เช็คว่าเป็นวันเดียวกันหรือไม่
      if (userDateYMD === todayFromUser) {
        createNewLog = false;
        merryCount = latestLog.count; // ใช้ count เดิม
      }
    }

    // 3. ถ้าไม่มี log วันนี้ ให้สร้างใหม่ด้วย count = merry_per_day
    if (createNewLog) {
      const now = new Date();
      const { data: newLog, error: createError } = await supabase
        .from("merry_count_log")
        .insert({
          user_id: user_id,
          user_package_id: user_package_id,
          log_date: todayFromUser,
          count: packageInfo.merry_per_day,
          created_at: now.toISOString(),
        })
        .select()
        .single();

      if (createError) {
        throw new Error(createError.message);
      }

      merryCount = newLog.count;
    }

    // 4. Return ข้อมูลตามที่ต้องการ
    return res.status(200).json({
      user_id: user_id,
      package_name: packageInfo.package_name,
      count: merryCount,
      merry_per_day: packageInfo.merry_per_day,
      log_date: todayFromUser,
    });
  } catch (error) {
    console.error("Error checking merry limit:", error);
    return res.status(500).json({
      error: error.message,
      count: 0,
      merry_per_day: 10,
    });
  }
}
