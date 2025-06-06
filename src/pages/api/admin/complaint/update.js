// pages/api/admin/complaint/[id].js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("complaint").select("*").eq("id", id).single();

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      if (!data) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "PATCH") {
    const { update_to } = req.body;

    if (!update_to) {
      return res.status(400).json({ message: "Missing update_to field" });
    }

    const validStatuses = ["pending", "resolved", "cancel"];
    if (!validStatuses.includes(update_to)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      // เตรียมข้อมูลสำหรับอัปเดต
      const updateData = {
        status: update_to,
        updated_at: new Date().toISOString(),
      };

      // จัดการ resolved_date ตามเงื่อนไข
      if (update_to === "resolved") {
        updateData.resolved_date = new Date().toISOString();
      } else {
        updateData.resolved_date = null;
      }

      // อัปเดตข้อมูล
      const { data, error } = await supabase.from("complaint").update(updateData).eq("id", id).select().single();

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(200).json({
        success: true,
        message: `Status updated to ${update_to}`,
        data,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
