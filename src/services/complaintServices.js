// src/services/complaintServices.js
class ComplaintApiService {
  async updateComplaintStatus(complaintId, updateTo) {
    try {
      const response = await fetch(`/api/admin/complaint/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          update_to: updateTo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // เพิ่มเมธอดสำหรับดึงข้อมูล complaint
  async getComplaint(complaintId) {
    try {
      const response = await fetch(`/api/admin/complaint/${complaintId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
}

export const complaintService = new ComplaintApiService();
