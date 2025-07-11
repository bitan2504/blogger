"use client";
import React from "react";
import { MenubarContextProvider } from "@/context/MenubarContext";
import App from "./app";

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MenubarContextProvider>
      <App>{children}</App>
    </MenubarContextProvider>
  );
}
