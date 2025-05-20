import { useRouter } from "next/router";

export function useFooterVisibility() {
  const router = useRouter();
  const hideFooterPaths = ["/matching", "/chat"];
  const shouldShowFooter = !hideFooterPaths.includes(router.pathname);

  return { shouldShowFooter };
}
