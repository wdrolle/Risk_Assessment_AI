import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center min-h-screen justify-center">
      {children}
    </div>
  );
};

export default Layout;
