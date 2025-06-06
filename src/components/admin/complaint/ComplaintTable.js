// File: src/components/admin/complaint/ComplaintTable.js

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ComplaintTable({ filters }) {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Fetch data
  const fetchComplaints = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: "10",
      });

      if (filters.issue.trim()) {
        params.append("issue", filters.issue.trim());
      }
      if (filters.status.trim()) {
        params.append("status", filters.status.trim());
      }

      const response = await fetch(`/api/admin/complaint/complaints?${params}`);
      const result = await response.json();

      setComplaints(result.data || []);
      setPagination(
        result.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (error) {
      console.error("Error:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, filters.issue, filters.status]);

  // Initial load
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // When page changes
  useEffect(() => {
    fetchComplaints();
  }, [pagination.currentPage, fetchComplaints]);

  // When filters change (from parent)
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchComplaints();
  }, [filters.issue, filters.status, fetchComplaints]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  // Handle row click to navigate to detail page
  const handleRowClick = (complaintId) => {
    router.push(`/admin/complaint/${complaintId}`);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleDateString("en-GB");
  };

  const truncateDescription = (text, maxLength = 80) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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

  return (
    <div className="bg-white rounded-xl">
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#D6D9E4] text-[#424C6B]">
            <tr>
              <th className="px-4 py-3 rounded-tl-xl">User</th>
              <th className="px-4 py-3">Issue</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Date Submit</th>
              <th className="px-4 py-3 rounded-tr-xl">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
                  <p>Loading complaints...</p>
                </td>
              </tr>
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-12 text-center">
                  No complaints found
                  {(filters.issue || filters.status) && <div className="mt-2 text-sm">Try adjusting your search criteria</div>}
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="hover:bg-gray-50 text-black cursor-pointer transition-colors duration-200"
                  onClick={() => handleRowClick(complaint.id)}
                  title="Click to view details"
                >
                  <td className="px-4 py-3">{complaint.user_name}</td>
                  <td className="px-4 py-3">{complaint.issue || "-"}</td>
                  <td className="px-4 py-3">
                    <div title={complaint.description}>{truncateDescription(complaint.description)}</div>
                  </td>
                  <td className="px-4 py-3">{formatDate(complaint.created_at)}</td>
                  <td className="px-4 py-3">{getStatusBadge(complaint.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 p-6">
          <div className="text-sm text-gray-700">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={16} />
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      pageNum === pagination.currentPage ? "bg-[#C70039] text-white border-[#C70039]" : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
