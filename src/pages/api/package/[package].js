import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { package: packageName } = req.query;

  // 1. รองรับเฉพาะ GET
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  // 2. ถ้าไม่มีชื่อแพ็กเกจ
  if (!packageName) {
    return res
      .status(400)
      .json({ success: false, error: "Missing package name" });
  }

  // 3. ดึงจาก Supabase
  const { data, error } = await supabase
    .from("packages")
    .select("package_name, price, merry_per_day, description")
    .eq("package_name", packageName.toLowerCase().trim())
    .single();

  // 4. ถ้า error หรือไม่พบข้อมูล
  if (error || !data) {
    return res
      .status(404)
      .json({ success: false, error: "Package not found" });
  }

  // 5. สำเร็จ
  return res.status(200).json({ success: true, package: data });
}
