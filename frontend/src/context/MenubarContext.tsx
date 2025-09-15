"use client";
import { createContext, useContext, useState } from "react";

const MenubarContext = createContext<{
  exploreOptionVisibility: boolean;
  toggleExploreOptions: (event: { preventDefault: () => void }) => void;
  menubarVisibility: boolean;
  toggleMenubarVisibility: (event: { preventDefault: () => void }) => void;
} | null>(null);

export function MenubarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [exploreOptionVisibility, setExploreOptionVisibility] = useState(false);
  const [menubarVisibility, setMenubarVisibility] = useState(true);

  function toggleExploreOptions(event: { preventDefault: () => void }): void {
    event.preventDefault();
    setExploreOptionVisibility(!exploreOptionVisibility);
  }

  function toggleMenubarVisibility(event: { preventDefault: () => void }): void {
    event.preventDefault();
    setMenubarVisibility(!menubarVisibility);
  }

  return (
    <MenubarContext.Provider
      value={{
        exploreOptionVisibility,
        toggleExploreOptions,
        menubarVisibility,
        toggleMenubarVisibility
      }}
    >
      {children}
    </MenubarContext.Provider>
  );
}

export default function useMenubarContext() {
    const context = useContext(MenubarContext);
    if (!context) {
        throw new Error("useMenubarContext must be used within a MenubarContextProvider");
    }
    return context;
}