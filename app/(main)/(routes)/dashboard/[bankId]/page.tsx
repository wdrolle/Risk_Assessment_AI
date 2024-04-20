"use client";

import TrainModel from "@/components/train-model";
import { getBankWithId } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Page = ({
  params,
}: {
  params: {
    bankId: string;
  };
}) => {
  useEffect(() => {
    const fetchBankStatus = async () => {
      const bank = await getBankWithId(params.bankId);
      if (bank?.status !== "files_uploaded") return redirect(`/onboarding`);
    };
    fetchBankStatus();
  }, []);

  return <TrainModel />;
};

export default Page;
