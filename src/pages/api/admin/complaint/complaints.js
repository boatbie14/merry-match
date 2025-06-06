// File: src/pages/api/admin/complaint/complaints.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("API called with query params:", req.query);

    const { page = 1, limit = 5, issue = "", status = "" } = req.query;

    console.log("Parsed params:", { page, limit, issue, status });

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // First get complaints
    let complaintQuery = supabase.from("complaint").select(
      `
        id,
        user_id,
        issue,
        description,
        created_at,
        status
      `,
      { count: "exact" }
    );

    // Apply filters
    if (issue && issue.trim() !== "") {
      complaintQuery = complaintQuery.ilike("issue", `%${issue.trim()}%`);
    }

    if (status && status.trim() !== "") {
      complaintQuery = complaintQuery.eq("status", status.trim());
    }

    // Apply ordering, pagination
    complaintQuery = complaintQuery.order("created_at", { ascending: false }).range(offset, offset + limitNumber - 1);

    const { data: complaints, error: complaintError, count } = await complaintQuery;

    if (complaintError) {
      console.error("Supabase Error:", complaintError);
      return res.status(500).json({
        message: "Error fetching complaints",
        error: complaintError.message,
        details: complaintError.details || null,
        hint: complaintError.hint || null,
      });
    }

    // Get user names for the complaints
    let transformedData = [];
    if (complaints && complaints.length > 0) {
      const userIds = [...new Set(complaints.map((c) => c.user_id).filter(Boolean))];

      let usersData = [];
      if (userIds.length > 0) {
        const { data: users, error: userError } = await supabase.from("users").select("id, name").in("id", userIds);

        if (userError) {
          console.error("Error fetching users:", userError);
        } else {
          usersData = users || [];
        }
      }

      // Create lookup map
      const userMap = {};
      usersData.forEach((user) => {
        userMap[user.id] = user.name;
      });

      // Transform data
      transformedData = complaints.map((complaint) => ({
        id: complaint.id,
        user_id: complaint.user_id,
        user_name: userMap[complaint.user_id] || "Unknown User",
        issue: complaint.issue,
        description: complaint.description,
        created_at: complaint.created_at,
        status: complaint.status,
      }));
    }

    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      data: transformedData,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems: count,
        itemsPerPage: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
