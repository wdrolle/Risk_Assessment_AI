"use client";
import { signOut } from "@/lib/server-actions/auth-actions";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const SignOut = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    const response = await signOut();
    console.log(response);
    if (!response) router.refresh();
  };
  return <Button onClick={handleSignOut}>Logout</Button>;
};

export default SignOut;
