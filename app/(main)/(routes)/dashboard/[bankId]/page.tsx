"use client";

import TrainModel from "@/components/train-model";
import { getAnalysis } from "@/lib/server-actions/ai-actions";
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
      await getAnalysis(params.bankId, {
        code: "NRA",
        riskCategory: "NRA Customers",
        lowRisk: "The institution does not have any NRA accounts.",
        moderateRisk:
          "Moderate level of NRA accounts from lower- risk geographies.",
        highRisk:
          "Significant number of NRA accounts from higher-risk geographies.",
      });
    };
    fetchBankStatus();
  }, []);

  return <TrainModel />;
};

export default Page;
