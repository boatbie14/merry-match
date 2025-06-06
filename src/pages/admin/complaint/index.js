//index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import ComplaintTable from "@/components/admin/complaint/ComplaintTable";

export default function ComplaintDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // States สำหรับ filters
  const [filters, setFilters] = useState({
    issue: "",
    status: "",
  });

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "pending", label: "Pending" },
    { value: "resolved", label: "Resolved" },
    { value: "cancel", label: "Cancel" },
  ];

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
        console.error("Error fetching user role:", userDataError.message);
        router.push("/login");
        return;
      }

      if (userData?.user_role !== "admin") {
        router.push("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  };

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-[#F6F7FD]">
      <AdminSidebar />
      <main className="flex-1 ">
        <AdminHeader
          title="Complaint List"
          showSearch={true}
          showStatusFilter={true}
          searchValue={filters.issue}
          statusValue={filters.status}
          onSearchChange={(value) => handleFilterChange("issue", value)}
          onStatusChange={(value) => handleFilterChange("status", value)}
          searchPlaceholder="Search..."
          statusOptions={statusOptions}
        />
        <div className="p-6 bg-[#F6F7FC]">
          <ComplaintTable filters={filters} />
        </div>
      </main>
    </div>
  );
}
