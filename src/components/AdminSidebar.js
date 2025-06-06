import Link from "next/link";
import { useRouter } from "next/router";
import { HiMiniCube } from "react-icons/hi2";
import { TbAlertTriangleFilled, TbLogout } from "react-icons/tb";

export default function AdminSidebar() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <aside className="w-64 min-h-screen bg-white flex flex-col justify-between border-r-[#D6D9E4] border-r-1">
      <div>
        {/* Logo และ Header */}
        <div className="px-6 py-6">
          <div className="text-3xl font-bold text-black text-center">
            Merry<span className="text-[#C70039] font-extrabold">Match</span>
          </div>
          <div className="text-sm text-[#646D89] mt-1 text-center">Admin Panel Control</div>
        </div>

        {/* Navigation Menu */}
        <nav className="pt-6">
          <ul>
            <li className={`p-6 ${currentPath === "/admin" ? "bg-[#F1F2F6]" : ""}`}>
              <Link href="/admin" className="flex gap-2 text-[#424C6B] font-extrabold">
                <HiMiniCube color="#FFB1C8" size={24} />
                Merry Package
              </Link>
            </li>
            <li className={`p-6 ${currentPath === "/admin/complaint" ? "bg-[#F1F2F6]" : ""}`}>
              <Link href="/admin/complaint" className="flex gap-2 text-[#424C6B] font-extrabold">
                <TbAlertTriangleFilled color="#FFB1C8" size={24} />
                Complaint
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-[#E4E6ED] mb-40">
        <button className="flex gap-2 text-[#424C6B] font-extrabold">
          <TbLogout color="#FFB1C8" size={24} />
          Log out
        </button>
      </div>
    </aside>
  );
}
