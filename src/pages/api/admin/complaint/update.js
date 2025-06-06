// pages/api/admin/complaint/update.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    // Handle GET request - fetch complaint details
    try {
      const { data, error } = await supabase
        .from("complaint")
        .select(
          `
          *,
          users (
            name
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Database error:", error);
        return res.status(400).json({ message: error.message });
      }

      if (!data) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "PATCH") {
    // Handle PATCH request - update complaint status
    console.log("PATCH Request - ID:", id);
    console.log("Request Body:", req.body);

    const { update_to } = req.body;

    if (!update_to) {
      return res.status(400).json({ message: "Missing update_to field" });
    }

    const validStatuses = ["pending", "resolved", "cancel"];
    if (!validStatuses.includes(update_to)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      // ตรวจสอบว่า complaint มีอยู่จริง
      const { data: existingComplaint, error: findError } = await supabase.from("complaint").select("*").eq("id", id).single();

      if (findError || !existingComplaint) {
        console.error("Complaint not found:", findError);
        return res.status(404).json({ message: "Complaint not found" });
      }

      // อัปเดต status
      const { data, error } = await supabase
        .from("complaint")
        .update({
          status: update_to,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(
          `
          *,
          users (
            name
          )
        `
        )
        .single();

      if (error) {
        console.error("Update error:", error);
        return res.status(400).json({ message: error.message });
      }

      console.log("Update successful:", data);

      return res.status(200).json({
        success: true,
        message: `Status updated to ${update_to}`,
        data,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
