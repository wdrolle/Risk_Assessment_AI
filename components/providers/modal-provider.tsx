"use client";

import { useEffect, useState } from "react";
import { CustomerModal } from "@/components/models/upload-customer-model";




export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CustomerModal />
      
    </>
  );
};
