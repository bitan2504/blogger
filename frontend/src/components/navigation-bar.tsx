"use client";
import useMenubarContext from "@/context/MenubarContext";
import Image from "next/image";

export default function NavigationBar() {
  const { toggleMenubarVisibility } = useMenubarContext();

  return (
    <nav className="flex items-center justify-between p-4 border-b-2 border-neutral-800">
      <aside className="flex gap-4 items-center">
        <div id="menubar-toggle-container">
          <button
            onClick={toggleMenubarVisibility}
            className="p-2 rounded-md hover:bg-neutral-700"
          >
            <Image
              src="/icons/menu.png"
              alt="Menu"
              width={24}
              height={24}
              className="invert-[0.6] brightness-75"
            />
          </button>
        </div>

        <div id="navbar-logo-container" className="flex items-center">
          <Image
            src="/img/navbar.png"
            alt="Logo"
            width="40"
            height="40"
            className="rounded-[50%]"
          />
          <span className="text-2xl font-bold">blogger</span>
        </div>
      </aside>

      <div
        id="search-bar-container"
        className="flex items-center border-2 border-gray-600 rounded-sm bg-neutral-800"
      >
        <div id="search-icon-container" className="p-2">
          <Image
            src="/icons/search.png"
            alt=""
            width={18}
            height={18}
            className="invert-[0.6] brightness-75"
          />
        </div>
        <input type="text" placeholder="Search..." className="outline-0" />
      </div>

      <div id="signin-button">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Sign In
        </button>
      </div>
    </nav>
  );
}
