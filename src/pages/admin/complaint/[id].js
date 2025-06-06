// src/pages/admin/complaint/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { FiArrowLeft } from "react-icons/fi";

export default function ComplaintDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  // ฟังก์ชันสำหรับอัปเดต status เป็น pending
  const updateStatusToPending = async (complaintId) => {
    try {
      const response = await fetch(`/api/admin/complaint/${complaintId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          update_to: "pending",
        }),
      });

      const result = await response.json();

      if (result.success) {
        // อัปเดต state หลังจากสำเร็จ
        setComplaint((prev) => ({
          ...prev,
          status: "pending",
        }));
      }
    } catch (error) {
      // Handle error silently
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        router.push("/login");
        return;
      }

      const { data: userData, error: userDataError } = await supabase.from("users").select("user_role").eq("id", user.id).single();

      if (userDataError) {
        router.push("/login");
        return;
      }

      if (userData?.user_role !== "admin") {
        router.push("/");
        return;
      }

      setIsAdmin(true);
    };

    checkAdmin();
  }, [router]);

  // ฟังก์ชันดึงข้อมูลชื่อ user
  const fetchUserName = async (userId) => {
    if (!userId) return "";

    try {
      const { data, error } = await supabase.from("users").select("name").eq("id", userId).single();

      if (error) {
        return "";
      }

      return data?.name || "";
    } catch (err) {
      return "";
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchComplaint = async () => {
      try {
        // ดึงข้อมูล complaint ก่อน
        const response = await fetch(`/api/admin/complaint/${id}`);
        const result = await response.json();

        if (result.success && result.data) {
          setComplaint(result.data);

          // ดึงข้อมูล user name ถ้ามี user_id
          if (result.data.user_id) {
            const userNameData = await fetchUserName(result.data.user_id);
            setUserName(userNameData);
          }

          // ถ้า status เป็น "new" ให้อัปเดตเป็น "pending" อัตโนมัติ
          if (result.data.status === "new") {
            updateStatusToPending(result.data.id);
          }

          setError(null);
        } else {
          setError(result.message || "Failed to fetch complaint");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleBackClick = () => {
    router.push("/admin/complaint");
  };

  // เพิ่มฟังก์ชันสำหรับ refresh ข้อมูล
  const refreshComplaint = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/admin/complaint/${id}`);
      const result = await response.json();

      if (result.success && result.data) {
        setComplaint(result.data);

        // ดึงข้อมูล user name อีกครั้ง
        if (result.data.user_id) {
          const userNameData = await fetchUserName(result.data.user_id);
          setUserName(userNameData);
        }

        setError(null);
      }
    } catch (err) {
      // Handle error silently
    }
  };

  // Callback สำหรับเมื่อ status เปลี่ยน
  const handleStatusUpdated = (newStatus) => {
    // อัปเดต complaint state ทันที
    if (complaint) {
      setComplaint({
        ...complaint,
        status: newStatus,
        // อัปเดต resolved_date ถ้าเปลี่ยนเป็น resolved
        resolved_date: newStatus === "resolved" ? new Date().toISOString() : null,
      });
    }
    // Refresh ข้อมูลจาก server
    setTimeout(refreshComplaint, 500);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleDateString("en-GB");
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  // ฟังก์ชันสำหรับแปลงเวลาเป็น GMT+7 และแสดงในรูปแบบที่ต้องการ
  const formatDateTimeGMT7 = (timestamp) => {
    if (!timestamp) return "-";

    const date = new Date(timestamp);

    // สร้าง options สำหรับ timezone GMT+7 (Bangkok)
    const options = {
      timeZone: "Asia/Bangkok",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleString("en-GB", options);

    // แปลงจาก "DD/MM/YYYY, HH:MM am/pm" เป็น "DD/MM/YYYY HH:MMAM/PM"
    const [datePart, timePart] = formattedDate.split(", ");
    const timeWithUpperCase = timePart.replace(" ", "").replace(/am/i, "AM").replace(/pm/i, "PM");

    return `${datePart} ${timeWithUpperCase}`;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      new: "bg-[#FAF1ED] text-[#7B4429]",
      pending: "bg-[#FFF6D4] text-[#393735]",
      resolved: "bg-[#E7FFE7] text-[#197418]",
      cancel: "bg-[#F1F2F6] text-[#646D89]",
    };

    const statusLabels = {
      new: "New",
      pending: "Pending",
      resolved: "Resolved",
      cancel: "Cancel",
    };

    return (
      <span className={`py-1 px-2.5 rounded-lg text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  if (!isAdmin) return null;

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex bg-[#F6F7FC] min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <AdminHeader title="Loading Complaint..." showBackButton={true} onBackClick={handleBackClick} />
          <div className="p-6 bg-[#F6F7FC]">
            <div className="bg-white rounded-xl p-8 flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              <p className="ml-4">Loading complaint details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ❌ Error or no complaint
  if (error || !complaint) {
    return (
      <div className="flex bg-[#F6F7FC] min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <AdminHeader title="Complaint Detail" showBackButton={true} onBackClick={handleBackClick} />
          <div className="p-6 bg-[#F6F7FC]">
            <div className="bg-white rounded-xl p-8">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error || "Complaint not found"}</p>
                <button
                  onClick={handleBackClick}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C70039] text-white rounded-md hover:bg-[#A62D82] transition-colors"
                >
                  <FiArrowLeft size={16} />
                  Back to Complaints
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ✅ Main content
  return (
    <div className="flex bg-[#F6F7FC] min-h-screen">
      <AdminSidebar />
      <main className="flex-1">
        <AdminHeader
          title={complaint.issue || "Complaint Detail"}
          showBackButton={true}
          onBackClick={handleBackClick}
          status={complaint.status}
          showComplaintActions={true}
          complaintStatus={complaint.status}
          onStatusUpdated={handleStatusUpdated}
        />

        <div className="p-6 bg-[#F6F7FC]">
          <div className="bg-white rounded-xl pt-10 pb-16 px-26">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <h2 className="text-[20px] font-semibold text-[#646D89]">
                Complaint by: <span className="text-[16px] text-black font-normal">{userName || complaint.user_name || "Unknown"}</span>
              </h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-[20px] font-semibold text-[#646D89] mb-4">Issue</h3>
                <p className="text-[16px] text-black font-normal">{complaint.issue || "-"}</p>
              </div>

              <div>
                <h3 className="text-[20px] font-semibold text-[#646D89] mb-4">Description</h3>
                <p className="text-[16px] text-black font-normal">{complaint.description || "-"}</p>
              </div>

              <div>
                <h3 className="text-[20px] font-semibold text-[#646D89] mb-4">Date Submitted</h3>
                <p className="text-[16px] text-black font-normal">{formatDate(complaint.created_at)}</p>
              </div>

              {/* แสดง Resolved date เฉพาะเมื่อ resolved_date มีค่า (ไม่ใช่ null) */}
              {complaint.resolved_date && (
                <>
                  <hr className="border-[#E4E6ED]" />
                  <div>
                    <h3 className="text-[20px] font-semibold text-[#646D89] mb-4">Resolved date</h3>
                    <p className="text-[16px] text-black font-normal">{formatDateTimeGMT7(complaint.resolved_date)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
