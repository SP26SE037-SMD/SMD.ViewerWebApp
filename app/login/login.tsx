"use client";

import GoogleIcon from "@/components/google-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import authApiRequest from "@/apiRequests/auth";
import { useAppContext } from "@/app/app-provider";
import { useGoogleOneTapLogin, GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setUser } = useAppContext();

  // 👉 THÊM HÀM NÀY MỚI
  const handleGoogleSuccess = async (idToken: string) => {
    setLoading(true);
    try {
      const response = await authApiRequest.loginGoogle({ idToken });

      if (response?.status === 200) {
        const payload = response.payload as any;
        const token = payload?.data?.token;
        const account = payload?.data?.account;

        if (token) {
          localStorage.setItem("sessionToken", token);
          if (account) {
            setUser({
              id: account.accountId,
              name: account.fullName || account.username,
              email: account.email,
              avatar: undefined,
            });
          }
          router.push("/home");
        } else {
          console.error("No token received from backend:", payload);
        }
      }
    } catch (error) {
      console.error("Error during Google backend integration:", error);
    } finally {
      setLoading(false);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      // Khi user click chọn tài khoản vào popup One Tap
      const idToken = credentialResponse.credential;
      if (idToken) {
        handleGoogleSuccess(idToken);
      }
    },
    onError: () => {
      console.error("One Tap Login Failed or modal closed by user");
    },
  });

  return (
    <section className="min-h-screen relative pt-32 pb-20 bg-[#c8f0d2] overflow-x-hidden">
      {/* Decorative Geometric Background Elements */}
      <motion.div
        animate={{ y: [0, -50, 0], rotate: [0, 50, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[15%] top-[10%] w-64 h-64 border-2 border-[#062C23]/10 opacity-60 pointer-events-none rounded-full"
      />
      <motion.div
        animate={{ y: [0, 50, 0], rotate: [0, 10, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[10%] top-[10%] w-32 h-32 bg-[#FFD074] border border-[#062C23]/10 pointer-events-none rounded-lg rotate-4"
      />
      <motion.div
        animate={{ y: [0, -25, 0], x: [0, 10, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[30%] top-[15%] w-24 h-24 bg-[#233E8B] border border-[#062C23]/10 pointer-events-none rounded-lg -rotate-4"
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dashed border-[#062C23]/30 text-sm mb-6 bg-white/30 backdrop-blur-sm text-[#062C23]">
                <span className="w-2 h-2 rounded-full bg-[#062C23] animate-pulse"></span>
                <span>Spring Semester 2026 is active</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-serif text-[#062C23] leading-[1.1] mb-6">
                The syllabus <br />
                system for <br />
                <span className="italic relative inline-block text-[#EA6227]">
                  future innovators.
                  {/* <svg
                    className="absolute -bottom-2 left-0 w-full animate-in fade-in duration-1000 delay-500"
                    viewBox="0 0 200 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.00025 7.00005C51.8906 2.67139 123.834 -2.67123 197.996 4.01509"
                      stroke="#062C23"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg> */}
                </span>
              </h1>

              <p className="text-lg text-[#062C23]/80 max-w-md leading-relaxed font-medium">
                Track course progress, receive change notifications, and manage
                your study schedule intelligently.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-white text-black px-8 h-14 text-base border border-black hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:scale-105 transition-transform duration-200 rounded-sm"
              >
                Explore Features
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Card (Login) */}
          <div className="relative animate-in fade-in zoom-in duration-700 delay-200">
            <Card className="w-full max-w-md mx-auto bg-white shadow-[8px_8px_0px_0px_#062C23] border-2 border-[#062C23] rounded-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#062C23]">
              <CardContent className="p-8 space-y-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-[#A6FBC9]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#A6FBC9]/50">
                    <GoogleIcon />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-[#062C23]">
                    Welcome Back!
                  </h3>
                  <p className="text-gray-500">
                    Sign in to access your student portal
                  </p>
                </div>

                <div className="flex justify-center w-full min-h-[56px] items-center">
                  {loading ? (
                    // Hiệu ứng Loading nhẹ nhàng nếu muốn
                    <p className="text-sm text-gray-500 font-medium">Đang xử lý đăng nhập...</p>
                  ) : (
                    // Nút bấm chuẩn của thư viện
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        const idToken = credentialResponse.credential;
                        if (idToken) {
                          handleGoogleSuccess(idToken);
                        }
                      }}
                      onError={() => {
                        console.error("Standard Google Login Failed");
                      }}
                      // Tùy chỉnh nhẹ giao diện nút (trắng, góc bo)
                      theme="outline"
                      size="large"
                      shape="circle"
                      width="300px" // Cho nó full chiều ngang Card
                    />
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  By clicking continue, you agree to our{" "}
                  <a href="#" className="underline hover:text-gray-600">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-gray-600">
                    Privacy Policy
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
