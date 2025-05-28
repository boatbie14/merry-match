import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiPackage, FiAlertTriangle, FiLogOut } from 'react-icons/fi'

export default function AdminSidebar() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <aside className="w-64 min-h-screen bg-white border-r-gray-400 flex flex-col">
      {/* Logo และ Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="text-2xl font-bold text-[#C70039]">
          Merry<span className="text-black">Match</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">Admin Panel Control</div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 mt-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                currentPath === '/admin'
                  ? 'bg-gray-100 text-[#212132] font-semibold'
                  : 'text-[#212132] hover:bg-gray-100'
              }`}
            >
              <FiPackage className="text-pink-400" />
              Merry Package
            </Link>
          </li>
          <li>
            <Link
              href="/admin/complaint"
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                currentPath === '/admin/complaint'
                  ? 'bg-gray-100 text-[#212132] font-semibold'
                  : 'text-[#212132] hover:bg-gray-100'
              }`}
            >
              <FiAlertTriangle className="text-pink-400" />
              Complaint
            </Link>
          </li>
        </ul>
      </nav>

      {/* เส้นคั่นก่อน Logout */}
      <div />

      {/* Logout */}
      <button className="flex items-center gap-2 text-[#212132] hover:bg-gray-100 px-4 py-3 w-full transition">
        <FiLogOut className="text-pink-400" />
        Log out
      </button>
    </aside>
  );
}
