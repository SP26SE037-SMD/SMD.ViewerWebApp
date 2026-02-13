"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";

export function HomePage() {
  return (
    <section className="relative pt-32 pb-20 bg-[#A6FBC9] overflow-hidden">
      {/* Decorative Geometric Background Elements */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[15%] top-[20%] w-64 h-64 border-2 border-[#062C23]/10 opacity-40 pointer-events-none rounded-full"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, 10, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[10%] top-[15%] w-32 h-32 bg-[#FFD074] border border-[#062C23]/10 pointer-events-none rounded-tr-3xl"
      />
      <motion.div
        animate={{ y: [0, -25, 0], x: [0, 10, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[25%] top-[40%] w-24 h-24 bg-[#062C23]/5 border border-[#062C23]/10 pointer-events-none rounded-lg rotate-12"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dashed border-[#062C23]/30 text-sm mb-6 bg-white/30 backdrop-blur-sm text-[#062C23]">
                <span className="w-2 h-2 rounded-full bg-[#062C23] animate-pulse"></span>
                <span>Spring Semester 2026 is active</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-mono text-[#062C23] leading-[1.1] mb-6">
                The learning <br />
                platform for <br />
                <span className="italic relative inline-block">
                  future innovators.
                  <svg
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
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-[#062C23]/80 max-w-md leading-relaxed font-medium">
                Access your complete syllabus, track CLOs, and manage your
                academic journey in minutes. Simple, fast, and designed for your
                success.
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
                className="bg-[#062C23] text-[#A6FBC9] hover:bg-[#083D31] px-8 h-14 rounded-lg text-base cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg"
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
                    <svg
                      viewBox="0 0 24 24"
                      className="w-8 h-8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0)">
                        <path
                          d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12.24 24.0008C15.4766 24.0008 18.2058 22.9382 20.19 21.1039L16.323 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12.24 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.0344664 12.24 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.24 4.74966Z"
                          fill="#EA4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-[#062C23]">
                    Welcome Back!
                  </h3>
                  <p className="text-gray-500">
                    Sign in to access your student portal
                  </p>
                </div>

                <Button className="w-full h-14 text-base font-medium bg-white text-[#062C23] border-2 border-gray-200 hover:bg-gray-50 hover:border-[#062C23] relative group overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0)">
                        <path
                          d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12.24 24.0008C15.4766 24.0008 18.2058 22.9382 20.19 21.1039L16.323 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12.24 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.0344664 12.24 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.24 4.74966Z"
                          fill="#EA4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    Continue with Google
                  </span>
                </Button>

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
