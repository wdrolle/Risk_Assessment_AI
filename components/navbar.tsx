import React from "react";
import SideBar from "./SideBar";
import { ModeToggle } from "./mode-toggle";
import { UserButton } from "@clerk/nextjs";
import Notifications from "@/components/notifications";

const NavBar = () => {
  return (
    <div className="flex w-full  shadow-xl border-b-2">
      <div className="flex w-full m-5">
        <SideBar />
      </div>

      <div className="flex-1  flex m-5 items-center gap-x-1.5">
        <div className="flex">
          <Notifications />
        </div>
        <div className="flex">
          <ModeToggle />
        </div>
        <div className="flex bg-white rounded-full">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
