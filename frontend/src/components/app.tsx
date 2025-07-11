"use client";
import React from "react";
import NavigationBar from "./navigation-bar";
import MenuBar from "./menubar";
import useMenubarContext from "@/context/MenubarContext";

export default function App({ children }: { children: React.ReactNode }) {
  const { menubarVisibility } = useMenubarContext();
  return (
    <div className="app-container">
      <NavigationBar />
      <div className="grid grid-cols-[220px_1fr] gap-6 min-h-screen">
        {menubarVisibility && (
          <aside className="border-r-2 border-neutral-900">
            <MenuBar />
          </aside>
        )}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
