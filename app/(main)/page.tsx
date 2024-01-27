import { redirect } from "next/navigation";
import React from "react";

const EntryPoint = () => {
  return redirect("/dashboard");
};

export default EntryPoint;
