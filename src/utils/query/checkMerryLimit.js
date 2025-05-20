import { supabase } from '@/lib/supabaseClient';
const FREE_PACKAGE_ID = "6c3e5251-6ba4-4c79-a305-22cfaaecb47c";

export async function checkMerryLimit(user_id, dateString = null) {
  try {
    // กำหนดวันที่
    let clientDate;
    let todayYMD;

    if (dateString) {
      clientDate = new Date(dateString);
      todayYMD = clientDate.toISOString().split("T")[0];
    } else {
      clientDate = new Date();
      clientDate.setHours(clientDate.getHours() + 7);
      todayYMD = clientDate.toISOString().split("T")[0];
    }

    // ตรวจสอบว่ามีแพ็กเกจที่ active หรือไม่
    const { data: activePackage, error: packageError } = await supabase
      .from("user_packages")
      .select("*, packages(*)")
      .eq("user_id", user_id)
      .eq("package_status", "active")
      .single();

    if (packageError && packageError.code !== "PGRST116") {
      throw new Error(packageError.message);
    }

    let packageInfo;
    let user_package_id;

    if (activePackage) {
      packageInfo = activePackage.packages;
      user_package_id = activePackage.id;
    } else {
      // ถ้าไม่มีแพ็กเกจ ให้สร้าง Free Package
      const { data: freePackage, error: freePackageError } = await supabase
        .from("packages")
        .select("*")
        .eq("id", FREE_PACKAGE_ID)
        .single();

      if (freePackageError) {
        throw new Error(`ไม่พบข้อมูล Free Package: ${freePackageError.message}`);
      }

      packageInfo = freePackage;
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(now.getDate() + freePackage.duration_days);

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

    // ตรวจสอบ log การใช้งานประจำวัน
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

    return {
      success: true,
      data: {
        user_id: user_id,
        package_name: packageInfo.package_name,
        count: merryCount,
        merry_per_day: packageInfo.merry_per_day,
        log_date: todayYMD,
      },
    };
  } catch (error) {
    console.error("Error in checkMerryLimit:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
