// pages/api/admin/complaint/[id].js
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { id } = req.query;

  console.log("API Called:", {
    method: req.method,
    id: id,
    body: req.body,
  });

  if (req.method === "GET") {
    try {
      console.log("Fetching complaint with ID:", id);

      const { data, error } = await supabase.from("complaint").select("*").eq("id", id).single();

      if (error) {
        console.error("Supabase error:", error);
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (!data) {
        console.log("No complaint found");
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      console.log("Complaint found:", data);
      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { update_to } = req.body;

      console.log("Updating complaint:", { id, update_to });

      if (!update_to) {
        return res.status(400).json({
          success: false,
          message: "Missing update_to field",
        });
      }

      const validStatuses = ["pending", "resolved", "cancel"];
      if (!validStatuses.includes(update_to)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const { data, error } = await supabase.from("complaint").update({ status: update_to }).eq("id", id).select().single();

      if (error) {
        console.error("Update error:", error);
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      console.log("Update successful:", data);
      return res.status(200).json({
        success: true,
        message: `Status updated to ${update_to}`,
        data: data,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}
