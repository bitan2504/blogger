"use client";
import Link from "next/link";
import Image from "next/image";
import useMenubarContext from "@/context/MenubarContext";

function ExploreOptions() {
  return (
    <ul id="explore-options-list" className="flex flex-col gap-2 p-2 pl-16">
      <li id="explore-option-top" className="hover:font-bold">
        <Link href="/blogs/top">Top</Link>
      </li>
      <li id="explore-option-recent" className="hover:font-bold">
        <Link href="/blogs/recent">Recent</Link>
      </li>
      <li id="explore-option-following" className="hover:font-bold">
        <Link href="/blogs/following">Following</Link>
      </li>
    </ul>
  );
}

export default function MenuBar() {
  const { exploreOptionVisibility, toggleExploreOptions } = useMenubarContext();

  return (
    <div id="menubar-container">
      <ul id="menubar-list" className="flex flex-col p-2">
        <li
          id="menubar-home-container"
          className="w-full flex items-center gap-4 p-4 rounded-b-md hover:bg-neutral-900"
        >
          <div id="menubar-home-icon-container">
            <Image
              src="/icons/home.png"
              alt="Home"
              width="24"
              height="24"
              className="invert"
            />
          </div>
          <div id="menubar-home-link-container">
            <Link href="/">
              <b>Home</b>
            </Link>
          </div>
        </li>

        <li id="menubar-explore-container" className="">
          <button
            onClick={toggleExploreOptions}
            className="w-full cursor-pointer flex items-center gap-4 p-4 rounded-b-md hover:bg-neutral-900"
          >
            <div id="menubar-explore-icon-container">
              <Image
                src="/icons/compass.png"
                alt="Explore"
                width="24"
                height="24"
                className="invert"
              />
            </div>
            <b>Explore</b>
          </button>
          <div className="duration-100">
            {exploreOptionVisibility && <ExploreOptions />}
          </div>
        </li>
      </ul>
    </div>
  );
}
