import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { userId, newPlan } = req.body;

  if (!userId || !newPlan) {
    return res.status(400).json({
      allowed: false,
      reason: "Missing user ID or package name.",
    });
  }

  try {
    // 1. ดึงแพ็กเกจปัจจุบันของ user พร้อม merry และ end_date
    const { data: current, error: currentError } = await supabase
      .from("user_packages")
      .select("packages(package_name, merry_per_day), end_date")
      .eq("user_id", userId)
      .single();

    if (currentError) {
      console.error("❌ Supabase error:", currentError.message);
      return res.status(500).json({
        allowed: false,
        reason: "Unable to retrieve your current subscription.",
      });
    }

    // ✅ ไม่มีแพ็กเกจเดิม → สมัครได้
    if (!current || !current.packages?.package_name) {
      return res.status(200).json({ allowed: true });
    }

    const currentPlan = current.packages.package_name.toLowerCase();
    const currentMerry = current.packages.merry_per_day;
    const endDate = current.end_date;

    // 2. ดึงข้อมูลแพ็กเกจใหม่
    const { data: newPackage, error: newPackageError } = await supabase
      .from("packages")
      .select("package_name, merry_per_day")
      .eq("package_name", newPlan)
      .single();

    if (newPackageError || !newPackage) {
      console.error("❌ Invalid new package:", newPlan);
      return res.status(400).json({
        allowed: false,
        reason: "Invalid package selected.",
      });
    }

    const newPlanName = newPackage.package_name.toLowerCase();
    const newMerry = newPackage.merry_per_day;

    // ✅ เปรียบเทียบแพ็กเกจ
    if (newPlanName === currentPlan) {
      return res.status(200).json({
        allowed: false,
        reason: "You are already subscribed to this package.",
      });
    }

    if (newMerry > currentMerry) {
      return res.status(200).json({ allowed: true }); // ✅ อัปเกรดได้ทันที
    }

    const formattedEndDate = new Date(endDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return res.status(200).json({
      allowed: false,
      reason: `You can downgrade after your current subscription ends on ${formattedEndDate}.`,
    });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return res.status(500).json({
      allowed: false,
      reason: "An unexpected error occurred. Please try again later.",
    });
  }
}
