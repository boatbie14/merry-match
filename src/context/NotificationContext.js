//// this is 10/6
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  act,
} from "react";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

const NotificationContext = createContext();

export function NotificationContextProvider({ children }) {
  const { userInfo } = useAuth();
  const [isPackageName, setIsPackageName] = useState(false);

  useEffect(() => {
    const fetchPackageData = async () => {
      if (!userInfo?.id) return;

      try {
        // Step 1: Query user_packages to get package_id
        const { data: userPackage, error: userPackageError } = await supabase
          .from("user_packages")
          .select("package_id, package_status")
          .eq("user_id", userInfo.id)
          .single();

        if (userPackageError) throw userPackageError;

        const packageId = userPackage?.package_id;
        if (!packageId) return;

        // Step 2: Query packages to check if package_name is "Free"
        const { data: packageData, error: packageError } = await supabase
          .from("packages")
          .select("package_name")
          .eq("id", packageId)
          .single();

        if (packageError) throw packageError;

        // Step 3: Check if package_name is "Free"
        if (userPackage?.package_status === "active") {
          setIsPackageName(packageData.package_name);
        } else {
          setIsPackageName(false);
        }
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };

    fetchPackageData();
  }, [userInfo]);

  return (
    <NotificationContext.Provider value={{ isPackageName }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
