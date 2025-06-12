import { useState } from "react"
import Link from "next/link";
import { useRouter } from "next/router";
import { HiMiniCube } from "react-icons/hi2";
import { TbAlertTriangleFilled, TbLogout } from "react-icons/tb";
import { supabase } from '@/lib/supabaseClient'

export default function AdminSidebar() {
  const router = useRouter();
  const currentPath = router.pathname;

  // สร้าง state เก็บ id ของเมนูที่ hover อยู่ (ถ้ามี)
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert('Failed to logout: ' + error.message)
    } else {
      router.push('/login')
    }
  }

  return (
    <aside className="w-64 min-h-screen bg-white flex flex-col justify-between border-r-[#D6D9E4] border-r-1">
      <div>
        <div className="px-6 py-6">
          <div className="text-3xl font-bold text-black text-center">
            Merry<span className="text-[#C70039] font-extrabold">Match</span>
          </div>
          <div className="text-sm text-[#646D89] mt-1 text-center">Admin Panel Control</div>
        </div>

        <nav className="pt-6">
          <ul>
            <li
              className={`p-6 ${currentPath === "/admin" ? "bg-[#F1F2F6]" : ""}`}
              onMouseEnter={() => setHoveredMenu("package")}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <Link href="/admin" className="flex gap-2 text-[#424C6B] font-extrabold items-center">
                {/* เปลี่ยนสีไอคอนตอน hover */}
                <HiMiniCube color={hoveredMenu === "package" ? "#FF69B4" : "#FFB1C8"} size={24} />
                Merry Package
              </Link>
            </li>
            <li
              className={`p-6 ${currentPath.startsWith("/admin/complaint") ? "bg-[#F1F2F6]" : ""}`}
              onMouseEnter={() => setHoveredMenu("complaint")}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <Link href="/admin/complaint" className="flex gap-2 text-[#424C6B] font-extrabold items-center">
                <TbAlertTriangleFilled color={hoveredMenu === "complaint" ? "#FF69B4" : "#FFB1C8"} size={24} />
                Complaint
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="p-6 border-t border-[#E4E6ED] mb-40">
        <button
          onMouseEnter={() => setHoveredMenu("logout")}
          onMouseLeave={() => setHoveredMenu(null)}
          onClick={handleLogout}
          className={`flex gap-2 text-[#424C6B] font-extrabold items-center ${
            hoveredMenu === "logout" ? "cursor-pointer" : "cursor-default"
          }`}
          type="button"
        >
          <TbLogout color={hoveredMenu === "logout" ? "#FF69B4" : "#FFB1C8"} size={24} />
          Log out
        </button>
      </div>
    </aside>
  );
}
