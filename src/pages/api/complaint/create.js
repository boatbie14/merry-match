// pages/api/complaint/create.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { issue, description, user_id } = req.body;

    // Validation
    if (!issue || !description || !user_id) {
      return res.status(400).json({
        error: "Issue, description, and user_id are required",
      });
    }

    if (issue.trim().length < 5) {
      return res.status(400).json({
        error: "Issue must be at least 5 characters long",
      });
    }

    if (description.trim().length < 20) {
      return res.status(400).json({
        error: "Description must be at least 20 characters long",
      });
    }

    // ตรวจสอบว่า user_id มีอยู่จริงไหม
    const { data: userExists, error: userError } = await supabase.from("users").select("id").eq("id", user_id).single();

    if (userError || !userExists) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    // Insert complaint
    const { data, error } = await supabase
      .from("complaint")
      .insert([
        {
          user_id: user_id,
          issue: issue.trim(),
          description: description.trim(),
          status: "new",
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({
        error: "Failed to submit complaint",
        details: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({
        error: "Insert succeeded but no data returned",
      });
    }

    return res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: data[0],
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
