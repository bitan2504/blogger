import { useEffect, useState } from "react";
import MProfileCard from "../pages/profile/MProfileCard";

export default function MenuBar({ user }) {
  return (
    <div id="menubar-container">
      <MProfileCard user={user} />
    </div>
  );
}
