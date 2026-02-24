"use client";

import GoogleIcon from "@/components/google-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";

export function LoginPage() {
  return (
    <section className="min-h-screen relative pt-32 pb-20 bg-[#c8f0d2] overflow-hidden">
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
        className="absolute right-[10%] top-[15%] w-32 h-32 bg-[#FFD074] border border-[#062C23]/10 pointer-events-none rounded-t-lg rounded-b-lg"
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

      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dashed border-[#062C23]/30 text-sm mb-6 bg-white/30 backdrop-blur-sm text-[#062C23]">
                <span className="w-2 h-2 rounded-full bg-[#062C23] animate-pulse"></span>
                <span>Spring Semester 2026 is active</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-mono text-[#062C23] leading-[1.1] mb-6">
                The syllabus <br />
                system for <br />
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

                <Button className="w-full h-14 text-base font-medium bg-white text-[#062C23] border-2 border-gray-200 hover:bg-gray-50 hover:border-[#062C23] relative group overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <GoogleIcon />
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
