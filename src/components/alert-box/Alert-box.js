//// this is 10/6
// components/DesktopAlertMenuItems.js
import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
/// Link tag by next.js
import Link from "next/link";
/// useNavbar context
import { useNavbar } from "@/context/NavbarContext";
/// useNotification context
import { useNotification } from "@/context/NotificationContext";

/// encryption for chat link
import { encryptUserId } from "@/utils/crypto";

/// DesktopAlertMenuItems
export function DesktopAlertMenuItems() {
  const { userInfo, checkingLogin } = useAuth();
  const { notifications, markAsRead, loading, error } = useNotifications(
    userInfo?.id
  );
  const { isPackageName } = useNotification();
  const router = useRouter();

  const handleStartConversation = (notification) => {
    try {
      const chatToUserID = notification.from_user?.id;
      const encryptedId = encryptUserId(chatToUserID);
      if (encryptedId) {
        router.push(`/chat?u=${encryptedId}`);
      } else {
        console.error("Failed to encrypt user ID");
      }
    } catch (error) {
      console.error("Error in handleStartConversation:", error);
    }
  };

  if (checkingLogin || loading) return <p>Loading…</p>;
  if (!userInfo) return <p>Please log in to see your notifications.</p>;
  if (error) return <p>Error loading notifications.</p>;
  console.log("notifications", error);
  return (
    <>
      {isPackageName === "Free" && (
        <Link
          href="merry-package"
          className="bg-gradient-to-r from-[#742138] to-[#A878BF] p-2.5 rounded-4xl mx-3 my-2 text-white flex items-center justify-center cursor-pointer"
        >
          <span className="text-xs text-center font-bold">
            ✨ Get a membership to see a notification!
          </span>
        </Link>
      )}

      <Link
        href={isPackageName === "Free" ? "merry-package" : "#"}
        className={`desktop-alert-menu-items flex flex-col space-y-5  px- py-3 ${
          isPackageName === "Free" ? "blur-sm" : ""
        } `}
      >
        {notifications.map((n) => {
          const avatarSrc =
            n.from_user?.profile_image_url ||
            "https://pbs.twimg.com/media/FKWwGZFVUAY2lKN?format=jpg&name=small";
          return (
            <div
              key={n.id}
              onClick={() => {
                if (isPackageName !== "Free") {
                  markAsRead(n.id);
                  if (n.noti_type === "merry") {
                    if (
                      !(
                        window.location.pathname === "/merrylist" &&
                        new URLSearchParams(window.location.search).get(
                          "selectedBox"
                        ) === "merry-to-you"
                      )
                    ) {
                      const url = new URL(window.location.href);
                      url.pathname = "/merrylist";
                      url.searchParams.set("selectedBox", "merry-to-you");
                      window.location.href = url.toString();
                    }
                  } else {
                    handleStartConversation(n);
                  }
                }
              }}
              className="flex flex-row  relative p-3 rounded cursor-pointer "
            >
              <Image
                src={avatarSrc}
                alt="Alert-noti"
                width={32}
                height={32}
                className="w-[32px] h-[32px] rounded-full object-cover"
              />
              <div className="heart-icon absolute top-[33px] left-[33px]">
                <svg
                          width="10"
                          height="11"
                          viewBox="0 0 10 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_9802_3147)">
                            <path
                              d="M6.20801 1.15479C6.69329 1.05723 7.19783 1.09245 7.66699 1.2583L7.86426 1.33643C8.31676 1.53693 8.70781 1.85696 8.99512 2.26318C9.32347 2.72747 9.49995 3.28241 9.5 3.85107L9.48633 4.15771C9.35372 5.6731 8.26445 6.87998 7.38379 7.63916L7.38184 7.64111C6.77795 8.15705 6.12265 8.60962 5.42578 8.99072L5.41797 8.99463L5.40918 8.99951L5.31152 9.05811H5.26465C5.17954 9.08541 5.09097 9.10092 5.00098 9.10107C4.86272 9.10127 4.7265 9.06833 4.60352 9.00537V9.00635L4.60254 9.00537L4.59082 8.99854V8.99951L4.58203 8.99463L4.5752 8.99072C4.36853 8.87827 4.16573 8.75891 3.9668 8.6333V8.63428C3.49351 8.33647 3.04228 8.00441 2.61719 7.64111L2.61621 7.63916C1.6776 6.82961 0.500101 5.51053 0.5 3.85107L0.507812 3.63818C0.546114 3.14477 0.717606 2.66939 1.00488 2.26318C1.33315 1.79905 1.79706 1.44785 2.33301 1.2583L2.53613 1.19482C3.01403 1.06638 3.51933 1.06928 3.99805 1.20459L4.20117 1.271C4.49232 1.37833 4.76192 1.53444 5 1.73096C5.29248 1.48954 5.6332 1.3089 6.00195 1.20459L6.20801 1.15479Z"
                              fill="#FF1659"
                              stroke="white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_9802_3147">
                              <rect
                                width="10"
                                height="10"
                                fill="white"
                                transform="translate(0 0.101074)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
              </div>
               {n.noti_type === "first_chat" ||
                    (n.noti_type === "chat" && (
                      <div className="heart-icon absolute top-[33px] left-[28px]">
                        <svg
                          width="10"
                          height="11"
                          viewBox="0 0 10 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_9802_3147)">
                            <path
                              d="M6.20801 1.15479C6.69329 1.05723 7.19783 1.09245 7.66699 1.2583L7.86426 1.33643C8.31676 1.53693 8.70781 1.85696 8.99512 2.26318C9.32347 2.72747 9.49995 3.28241 9.5 3.85107L9.48633 4.15771C9.35372 5.6731 8.26445 6.87998 7.38379 7.63916L7.38184 7.64111C6.77795 8.15705 6.12265 8.60962 5.42578 8.99072L5.41797 8.99463L5.40918 8.99951L5.31152 9.05811H5.26465C5.17954 9.08541 5.09097 9.10092 5.00098 9.10107C4.86272 9.10127 4.7265 9.06833 4.60352 9.00537V9.00635L4.60254 9.00537L4.59082 8.99854V8.99951L4.58203 8.99463L4.5752 8.99072C4.36853 8.87827 4.16573 8.75891 3.9668 8.6333V8.63428C3.49351 8.33647 3.04228 8.00441 2.61719 7.64111L2.61621 7.63916C1.6776 6.82961 0.500101 5.51053 0.5 3.85107L0.507812 3.63818C0.546114 3.14477 0.717606 2.66939 1.00488 2.26318C1.33315 1.79905 1.79706 1.44785 2.33301 1.2583L2.53613 1.19482C3.01403 1.06638 3.51933 1.06928 3.99805 1.20459L4.20117 1.271C4.49232 1.37833 4.76192 1.53444 5 1.73096C5.29248 1.48954 5.6332 1.3089 6.00195 1.20459L6.20801 1.15479Z"
                              fill="#FF1659"
                              stroke="white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_9802_3147">
                              <rect
                                width="10"
                                height="10"
                                fill="white"
                                transform="translate(0 0.101074)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    ))}
              <span className="text-start  text-xs pl-4 ">{n.message}</span>
              {n.is_read !== true && (
                <div className="flex flex-col justify-center items-center ml-10">
                  <div className="bg-pink-600 rounded-full w-2 h-2"></div>
                </div>
              )}
            </div>
          );
        })}
      </Link>
    </>
  );
}

export function MobileAlertMenuItems() {
  const { userInfo, checkingLogin } = useAuth();

  /// Navbar context and it relevant function
  const { setIsAlertMobileMenuOpen } = useNavbar();
  const { notifications, markAsRead, loading, error } = useNotifications(
    userInfo?.id
  );
  const { isPackageName } = useNotification();
  const router = useRouter();

  const handleStartConversation = (notification) => {
    try {
      console.log("Hey User Id = " + notification.from_user?.id);
      const chatToUserID = notification.from_user?.id;
      const encryptedId = encryptUserId(chatToUserID);

      if (encryptedId) {
        router.push(`/chat?u=${encryptedId}`);
      } else {
        console.error("Failed to encrypt user ID");
      }
    } catch (error) {
      console.error("Error in handleStartConversation:", error);
    }
  };

  if (checkingLogin || loading) return <p>Loading…</p>;
  if (!userInfo) return <p>Please log in to see your notifications.</p>;
  if (error) return <p>Error loading notifications.</p>;

  return (
    <>
      {isPackageName === "Free" && (
        <button className="bg-gradient-to-r from-[#742138] to-[#A878BF] p-2.5 py-10 rounded-4xl mx-3 my-2 text-white flex items-center justify-center cursor-pointer">
          <span className="text-xs font-bold">
            ✨ Get a membership to see a notification!
          </span>
        </button>
      )}

      <div className="flex flex-col">
        <Link
          href={isPackageName === "Free" ? "merry-package" : "#"}
          className={`profile-menu-items space-y-5 px-0 mt-5 mb-5 text-3xl text-[#646D89] ${
            isPackageName === "Free" ? "blur-sm" : ""
          } `}
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
                  if (isPackageName !== "Free") {
                    if (n.noti_type === "merry") {
                      if (
                        !(
                          window.location.pathname === "/merrylist" &&
                          new URLSearchParams(window.location.search).get(
                            "selectedBox"
                          ) === "merry-to-you"
                        )
                      ) {
                        const url = new URL(window.location.href);
                        url.pathname = "/merrylist";
                        url.searchParams.set("selectedBox", "merry-to-you");
                        window.location.href = url.toString();
                      }
                    } else {
                      handleStartConversation(n);
                    }
                  }
                }}
                className="desktop-alert-menu-items flex flex-col space-y-5 px- py-3"
              >
                <div className="flex flex-row space-x-3  relative py-2 rounded cursor-pointer ">
                  <Image
                    src={avatarSrc}
                    alt="Alert-noti"
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                  <div className="heart-icon absolute top-[45px] left-[41px]">
                    <svg
                      width="10"
                      height="11"
                      viewBox="0 0 10 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_9802_3147)">
                        <path
                          d="M6.20801 1.15479C6.69329 1.05723 7.19783 1.09245 7.66699 1.2583L7.86426 1.33643C8.31676 1.53693 8.70781 1.85696 8.99512 2.26318C9.32347 2.72747 9.49995 3.28241 9.5 3.85107L9.48633 4.15771C9.35372 5.6731 8.26445 6.87998 7.38379 7.63916L7.38184 7.64111C6.77795 8.15705 6.12265 8.60962 5.42578 8.99072L5.41797 8.99463L5.40918 8.99951L5.31152 9.05811H5.26465C5.17954 9.08541 5.09097 9.10092 5.00098 9.10107C4.86272 9.10127 4.7265 9.06833 4.60352 9.00537V9.00635L4.60254 9.00537L4.59082 8.99854V8.99951L4.58203 8.99463L4.5752 8.99072C4.36853 8.87827 4.16573 8.75891 3.9668 8.6333V8.63428C3.49351 8.33647 3.04228 8.00441 2.61719 7.64111L2.61621 7.63916C1.6776 6.82961 0.500101 5.51053 0.5 3.85107L0.507812 3.63818C0.546114 3.14477 0.717606 2.66939 1.00488 2.26318C1.33315 1.79905 1.79706 1.44785 2.33301 1.2583L2.53613 1.19482C3.01403 1.06638 3.51933 1.06928 3.99805 1.20459L4.20117 1.271C4.49232 1.37833 4.76192 1.53444 5 1.73096C5.29248 1.48954 5.6332 1.3089 6.00195 1.20459L6.20801 1.15479Z"
                          fill="#FF1659"
                          stroke="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_9802_3147">
                          <rect
                            width="10"
                            height="10"
                            fill="white"
                            transform="translate(0 0.101074)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  {n.noti_type === "first_chat" ||
                    (n.noti_type === "chat" && (
                      <div className="heart-icon absolute top-[45px] left-[35px]">
                        <svg
                          width="10"
                          height="11"
                          viewBox="0 0 10 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_9802_3147)">
                            <path
                              d="M6.20801 1.15479C6.69329 1.05723 7.19783 1.09245 7.66699 1.2583L7.86426 1.33643C8.31676 1.53693 8.70781 1.85696 8.99512 2.26318C9.32347 2.72747 9.49995 3.28241 9.5 3.85107L9.48633 4.15771C9.35372 5.6731 8.26445 6.87998 7.38379 7.63916L7.38184 7.64111C6.77795 8.15705 6.12265 8.60962 5.42578 8.99072L5.41797 8.99463L5.40918 8.99951L5.31152 9.05811H5.26465C5.17954 9.08541 5.09097 9.10092 5.00098 9.10107C4.86272 9.10127 4.7265 9.06833 4.60352 9.00537V9.00635L4.60254 9.00537L4.59082 8.99854V8.99951L4.58203 8.99463L4.5752 8.99072C4.36853 8.87827 4.16573 8.75891 3.9668 8.6333V8.63428C3.49351 8.33647 3.04228 8.00441 2.61719 7.64111L2.61621 7.63916C1.6776 6.82961 0.500101 5.51053 0.5 3.85107L0.507812 3.63818C0.546114 3.14477 0.717606 2.66939 1.00488 2.26318C1.33315 1.79905 1.79706 1.44785 2.33301 1.2583L2.53613 1.19482C3.01403 1.06638 3.51933 1.06928 3.99805 1.20459L4.20117 1.271C4.49232 1.37833 4.76192 1.53444 5 1.73096C5.29248 1.48954 5.6332 1.3089 6.00195 1.20459L6.20801 1.15479Z"
                              fill="#FF1659"
                              stroke="white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_9802_3147">
                              <rect
                                width="10"
                                height="10"
                                fill="white"
                                transform="translate(0 0.101074)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    ))}
                  <div className="w-[271px] ml-6 ">
                    <span className="text-start text-sm ">{n.message}</span>
                  </div>
                  {n.is_read !== true && (
                    <div className="flex flex-col justify-center items-center ">
                      <div className="bg-pink-600 rounded-full w-2 h-2"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Link>
      </div>
    </>
  );
}
