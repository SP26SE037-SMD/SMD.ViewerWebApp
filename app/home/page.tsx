import React from "react";
import Home from "@/app/home/home";
import Header from "@/components/header";

export const metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <Home />
    </>
  );
}
