// src/components/admin/AdminHeader.js
import SearchInput from "./SearchInput";
import { FiArrowLeft } from "react-icons/fi";
import { useComplaintActions } from "@/hooks/useComplaintActions";
import { complaintService } from "../../services/complaintServices";

export default function AdminHeader({
  title,
  showSearch = false,
  showStatusFilter = false,
  searchValue = "",
  statusValue = "",
  onSearchChange,
  onStatusChange,
  searchPlaceholder = "Search...",
  statusOptions = [],
  showBackButton = false,
  onBackClick,
  status,
  showComplaintActions = false,
  complaintStatus,
  onStatusUpdated, // เพิ่ม prop นี้
}) {
  const { updateStatusToPending, updateStatusToResolved, updateStatusToCancel, isLoading } = useComplaintActions(complaintService);

  const getStatusBadge = (status) => {
    if (!status) return null;

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

  const handleAction = async (actionFn, newStatus) => {
    try {
      const result = await actionFn();
      if (result.success) {
        // เรียก callback function เพื่ออัปเดต UI
        onStatusUpdated?.(newStatus);

        // แสดงข้อความสำเร็จ
        alert(`Status updated to ${newStatus} successfully!`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Action error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const renderComplaintActions = () => {
    if (!showComplaintActions) return null;

    if (complaintStatus === "resolved" || complaintStatus === "cancel") {
      return (
        <button
          onClick={() => handleAction(updateStatusToPending, "pending")}
          disabled={isLoading}
          className={`primary-btn ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Updating..." : "Reopen Complaint"}
        </button>
      );
    }

    if (complaintStatus === "new" || complaintStatus === "pending") {
      return (
        <div className="flex gap-3">
          <button
            onClick={() => handleAction(updateStatusToCancel, "cancel")}
            disabled={isLoading}
            className={`ghost-btn ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Updating..." : "Cancel Complaint"}
          </button>
          <button
            onClick={() => handleAction(updateStatusToResolved, "resolved")}
            disabled={isLoading}
            className={`primary-btn ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Updating..." : "Resolve Complaint"}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white border-b border-[#D6D9E4] p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={onBackClick}
              className="flex items-center justify-center w-8 h-8 text-[#424C6B] hover:text-[#A62D82] transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
          )}

          <h1 className="text-2xl font-bold text-[#2A2E3F]">{title}</h1>
          {status && getStatusBadge(status)}
        </div>

        <div className="flex gap-4">
          {showComplaintActions ? (
            renderComplaintActions()
          ) : (
            <>
              {showSearch && <SearchInput value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} className="w-80" />}
              {showStatusFilter && (
                <div className="w-48">
                  <select
                    value={statusValue}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full px-3 py-2 border-1 border-gray-300 rounded-md focus:border-[#A62D82] focus:outline-none text-[#424C6B]"
                  >
                    <option value="">All status</option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
