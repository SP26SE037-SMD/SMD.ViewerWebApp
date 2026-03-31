"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import authApiRequest from "@/apiRequests/auth";
import accountApiRequest from "@/apiRequests/account";
import { useDispatch } from "react-redux";
import { setUser } from "@/provider/userSlice";
import { useGoogleOneTapLogin, GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Giả lập hoặc kiểm tra session lần đầu
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    if (isEmailLoading || isGoogleLoading) return;
    setIsEmailLoading(true);
    try {
      const result = await authApiRequest.login(values);
      if (!result || !result.payload || !result.payload.data) {
        throw new Error("Phản hồi từ server không hợp lệ");
      }
      const token = result.payload.data.token;
      await authApiRequest.auth({ sessionToken: token });
      localStorage.setItem("sessionToken", token);
      toast.success(result.payload.message);
      const account = result.payload.data.account;
      dispatch(setUser({
        accountId: String(account.accountId),
        email: account.email,
        fullName: account.fullName,
        avatarUrl: null,
        role: account.role,
      }));
      router.push("/home");
      router.refresh();
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setIsEmailLoading(false);
    }
  }

  const handleGoogleSuccess = async (idToken: string) => {
    if (isEmailLoading || isGoogleLoading) return;
    setIsGoogleLoading(true);
    try {
      const response = await authApiRequest.loginGoogle({ idToken });
      if (response?.status === 200) {
        const payload = response.payload as any;
        const token = payload?.data?.token;
        const account = payload?.data?.account;
        if (token) {
          if (account) {
            const userRole = typeof account.role === "string" 
                ? account.role 
                : (account.role?.roleName ?? "");
                
            if (userRole !== "LECTURER" && userRole !== "STUDENT") {
              toast.error("Tài khoản của bạn không có quyền truy cập vào hệ thống SMD.");
              setIsGoogleLoading(false);
              return;
            }

            let googleAvatarUrl: string | null = null;
            try {
              const decodedToken = jwtDecode<{ picture?: string }>(idToken);
              googleAvatarUrl = decodedToken.picture || null;
            } catch (err) {
              console.error("Failed to decode Google Token", err);
            }

            // Sync with backend
            try {
              await accountApiRequest.updateAccount(String(account.accountId), {
                fullName: account.fullName || "",
                phoneNumber: account.phoneNumber || "",
                avatarUrl: googleAvatarUrl || "",
              });
            } catch (updateErr) {
              console.error("Failed to update avatar on backend", updateErr);
            }

            localStorage.setItem("sessionToken", token);
            dispatch(setUser({
              accountId: String(account.accountId),
              email: account.email,
              fullName: account.fullName || "",
              avatarUrl: googleAvatarUrl,
              role: userRole,
            }));
            
            toast.success("Đăng nhập Google thành công");
            router.push("/home");
          } else {
            console.error("No account information received from backend");
          }
        } else {
          console.error("No token received from backend:", payload);
        }
      }
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
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
    <div className="h-screen w-screen flex items-center justify-center bg-[#f0f7ed] p-4 lg:p-8">
      {/* Loading Overlay cho toàn trang (nếu loading = true) */}
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-[#f0f7ed] flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6AB04C]"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chiếc Card chính */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-300 h-[85vh] lg:h-[90vh] 
                   bg-white/70 backdrop-blur-2xl border border-white 
                   rounded-[22px] overflow-hidden flex p-4 lg:p-4"
      >
        {/* ══════════════════════════════════════════════
          CỘT TRÁI — Brand & Visual
         ══════════════════════════════════════════════ */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex flex-col justify-center items-center w-full lg:w-[40%] h-full p-10 lg:p-12 rounded-[10px] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #e8f5e0 0%, #f3faf0 100%)",
            boxShadow: "inset 0 0 40px rgba(255,255,255,0.5)",
          }}
        >
          {/* Decorative floating shapes (triangles, circles, blobs) */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[18%] right-[12%] pointer-events-none"
            style={{
              width: 0,
              height: 0,
              borderLeft: "22px solid transparent",
              borderRight: "22px solid transparent",
              borderBottom: `38px solid #D4D44A`,
              opacity: 0.8,
            }}
          />

          {/* Peach rounded square */}
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[8%] w-10 h-10 rounded-xl pointer-events-none"
            style={{ background: "#E8C87A", opacity: 0.85 }}
          />

          {/* Soft green circle mid */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[45%] -left-10 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "rgba(106,176,76,0.15)" }}
          />

          {/* Small accent circle */}
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="hidden sm:block absolute bottom-[28%] right-[8%] w-8 h-8 rounded-full pointer-events-none"
            style={{ background: "#6AB04C", opacity: 0.3 }}
          />

          {/* Blobs trang trí */}
          <div className="absolute top-10 left-10 w-8 h-8 bg-[#E8C87A] rounded-lg rotate-12 opacity-60" />
          <div className="absolute bottom-20 right-10 w-6 h-6 bg-[#6AB04C] rounded-full opacity-20" />

          {/* ── Hero content (vertically centered) ── */}
          <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 z-10 relative">
            {/* Heading */}
            <div className="z-10 text-center mt-4">
              <h1 className="font-[Bricolage_Grotesque] font-bold text-[2.4rem] text-[#2D4A22] leading-[1.3] tracking-tight">
                The syllabus <br /> engine for <br />
                <span className="relative inline-block mt-2">
                  <span className="italic text-[#6AB04C]">learners</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 8"
                  >
                    <path
                      d="M0 6 Q50 0 100 5 Q150 10 200 4"
                      stroke="#6AB04C"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            {/* ── Main Illustration (Tree Book) ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full max-w-[320px] sm:max-w-95 lg:max-w-105 mx-auto"
            >
              {/* Glow hiệu ứng phía sau ảnh để làm nổi bật */}
              <div className="absolute inset-0 bg-olive-primary/10 blur-[60px] rounded-full scale-75" />
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 w-full flex justify-center"
              >
                <div className="absolute inset-0 bg-[#6AB04C]/10 blur-3xl rounded-full scale-75" />
                <Image
                  src="/tree-book-removebg.png"
                  alt="Tree Book"
                  width={380}
                  height={380}
                  priority
                  className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* ── Decorative perspective grid (bottom) ── */}
          <div className="absolute bottom-0 left-0 right-0 h-25 pointer-events-none z-0 overflow-hidden">
            <svg
              viewBox="0 0 400 160"
              preserveAspectRatio="none"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Horizontal lines (converging to vanishing point at top-center) */}
              {[0, 0.18, 0.35, 0.5, 0.65, 0.78, 0.88, 0.95, 1].map((t, i) => {
                const y = 160 * t;
                const xLeft = 200 - 200 * (1 - t * 0.7);
                const xRight = 200 + 200 * (1 - t * 0.7);
                return (
                  <line
                    key={`h-${i}`}
                    x1={xLeft}
                    y1={y}
                    x2={xRight}
                    y2={y}
                    stroke="#3D6B2C"
                    strokeWidth="0.6"
                    strokeOpacity={0.18 + t * 0.18}
                  />
                );
              })}

              {/* Vertical lines (radiating from vanishing point) */}
              {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((v, i) => (
                <line
                  key={`v-${i}`}
                  x1={200}
                  y1={0}
                  x2={200 + v * 55}
                  y2={160}
                  stroke="#3D6B2C"
                  strokeWidth="0.6"
                  strokeOpacity="0.16"
                />
              ))}
            </svg>

            {/* Accent color block strip at very bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-linear-to-r from-olive-accent-yellow via-olive-accent to-olive-primary opacity-60" />
          </div>
        </motion.aside>

        {/* ══════════════════════════════════════════════
          CỘT PHẢI — Login Form
         ══════════════════════════════════════════════ */}
        <motion.main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 h-full overflow-hidden">
          {/* Thêm Logo phía trên Card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Image
              src="/smd-with-name.png"
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </motion.div>

          {/* Chiếc Card chứa nội dung Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-135 bg-white rounded-[32px] p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100"
          >
            <div className="space-y-6 lg:space-y-5">
              {/* Header Form */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-[Bricolage_Grotesque] font-bold text-[#1A2E12] tracking-tight">
                  Welcome back
                </h2>
                <p className="text-[#5C7250] text-sm font-medium opacity-70">
                  Sign in to continue your journey
                </p>
              </div>

              {/* Login Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-700">
                          Email address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            {...field}
                            className="h-10 rounded-xl bg-[#f8faf7] border-none focus-visible:ring-1 focus-visible:ring-[#6AB04C]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-xs text-gray-700">
                            Password
                          </FormLabel>
                          <button
                            type="button"
                            className="text-xs font-semibold text-[#6AB04C] hover:underline"
                          >
                            Forgot?
                          </button>
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            className="h-11 rounded-xl bg-[#f8faf7] border-none focus-visible:ring-1 focus-visible:ring-[#6AB04C]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={isEmailLoading || isGoogleLoading}
                      className={`font-[Lexend] bg-[#6ab04c] text-[#F0F7ED] w-full h-11 shadow-[4px_4px_0px_0px_#1A2E12] rounded-sm transition-colors ${isEmailLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "opacity-100 hover:bg-[#2D4F21]"
                        }`}
                    >
                      {isEmailLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </Form>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-400">
                  <span className="bg-white px-3">Continue with</span>
                </div>
              </div>

              {/* Google Login */}
              <div className="w-full flex justify-center min-h-11">
                {isGoogleLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#6AB04C]" />
                    <span className="text-xs text-[#6AB04C] font-medium">
                      Authenticating...
                    </span>
                  </div>
                ) : (
                  <div
                    className={`w-full flex justify-center ${isEmailLoading ? "pointer-events-none opacity-40" : ""}`}
                  >
                    <GoogleLogin
                      onSuccess={(res) =>
                        res.credential && handleGoogleSuccess(res.credential)
                      }
                      theme="outline"
                      shape="pill"
                      width="100%" // Để nó tự co giãn theo card
                    />
                  </div>
                )}
              </div>

              {/* Terms */}
              <p className="text-[10px] text-[#8A9B81] text-center leading-relaxed">
                By signing in, you agree to our{" "}
                <a href="#" className="underline hover:text-[#6AB04C]">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-[#6AB04C]">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </motion.div>
        </motion.main>
      </motion.div>
    </div>
  );
}
