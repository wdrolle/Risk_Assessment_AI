"use client";

import TrainModel from "@/components/train-model";
import { getDataViaFiles } from "@/lib/server-actions/file-actions";
import { getBankWithId, getFilesByBankId } from "@/lib/supabase/queries";
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

    getDataViaFiles(params.bankId);
  }, []);

  return <TrainModel />;
};

export default Page;
