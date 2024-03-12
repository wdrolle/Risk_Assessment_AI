import NavBar from "@/components/navbar";
import React from "react";

const Layout =  ({ children }: { children: React.ReactNode }) => {
  

  return (
    <div className=" flex-col">
      <div className="flex w-full ">
        <NavBar />
      </div>
      <div className="flex flex-1 ">{children}</div>
    </div>
  );
};

export default Layout;
