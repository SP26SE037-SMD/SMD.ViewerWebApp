"use client";

import { useDispatch } from "react-redux";
import { logout } from "@/provider/userSlice";
import authApiRequest from "@/apiRequests/auth";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function ButtonLogout({ className, children }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer();
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      dispatch(logout());
      localStorage.removeItem("user");
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("sessionTokenExpiresAt");
      router.push("/login");
      router.refresh();
    }
  };
  return (
    <button className={className} onClick={handleLogout}>
      {children || "Đăng xuất"}
    </button>
  );
}
