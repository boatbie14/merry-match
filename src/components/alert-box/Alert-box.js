//// this is new one 
// components/DesktopAlertMenuItems.js
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
/// Link tag by next.js
import Link from "next/link";
/// useNavbar context
import { useNavbar } from "@/context/NavbarContext";

export function DesktopAlertMenuItems() {
  const { userInfo, checkingLogin } = useAuth();
  const { notifications, markAsRead, loading, error } = useNotifications(
    userInfo?.id
  );

  if (checkingLogin || loading) return <p>Loading…</p>;
  if (!userInfo) return <p>Please log in to see your notifications.</p>;
  if (error) return <p>Error loading notifications.</p>;
  console.log("notifications", error);
  return (
    <Link
      href="/"
      className="desktop-alert-menu-items flex flex-col space-y-5 px-4 py-3"
    >
      {notifications.map((n) => {
        const avatarSrc =
          n.from_user?.profile_image_url ||
          "https://pbs.twimg.com/media/FKWwGZFVUAY2lKN?format=jpg&name=small";
        return (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={
              "flex flex-row space-x-2 relative p-2 rounded cursor-pointer " +
              (n.is_read ? "bg-gray-200" : "")
            }
          >
            <Image
              src={avatarSrc}
              alt="Alert-noti"
              width={32}
              height={32}
              className="w-[32px] h-[32px] rounded-full object-cover"
            />
            <div className="heart-icon absolute top-[25px] left-[33px]">
              <FaHeart size={10} color="#FF1659" />
            </div>
            <span className="text-start text-xs">{n.message}</span>
          </div>
        );
      })}
    </Link>
  );
}

export function MobileAlertMenuItems() {
  const { userInfo, checkingLogin } = useAuth();

  /// Navbar context and it relevant function
  const { setIsAlertMobileMenuOpen } = useNavbar();

  const { notifications, markAsRead, loading, error } = useNotifications(
    userInfo?.id
  );

  if (checkingLogin || loading) return <p>Loading…</p>;
  if (!userInfo) return <p>Please log in to see your notifications.</p>;
  if (error) return <p>Error loading notifications.</p>;

  return (
    <div className="flex flex-col">
      <Link
        href="/"
        className="profile-menu-items space-y-5 px-0 mt-5 mb-5 text-3xl text-[#646D89]"
      >
        {notifications.map((n) => {
          const avatarSrc =
            n.from_user?.profile_image_url ||
            "https://pbs.twimg.com/media/FKWwGZFVUAY2lKN?format=jpg&name=small";
          return (
            <div
              key={n.id}
              onClick={() => {
                markAsRead(n.id);
                setIsAlertMobileMenuOpen(false);
              }}
              className="desktop-alert-menu-items flex flex-col space-y-5 px-4 py-3"
            >
              <div
                className={
                  "flex flex-row space-x-10 relative p-2 rounded cursor-pointer " +
                  (n.is_read ? "bg-gray-200" : "")
                }
              >
                <Image
                  src={avatarSrc}
                  alt="Alert-noti"
                  width={50}
                  height={50}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div className="heart-icon absolute top-[40px] left-[50px]">
                  <FaHeart size={10} color="#FF1659" />
                </div>
                <span className="text-start text-sm">{n.message}</span>
              </div>
            </div>
          );
        })}
      </Link>
    </div>
  );
}

