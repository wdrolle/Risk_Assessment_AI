"use client";
import React, { useEffect, useState } from "react";
import { bank } from "@/types";
import { getBanksData } from "@/lib/bankData";
import { useRouter } from "next/navigation";

const RiskAssementForm = ({ selectedBankID: bankId }: { selectedBankID: string }) => {
  const [banksData, setBanksData] = useState<bank | null>(null);
  const router = useRouter();

  const getBankData = async () => {
    const response = await getBanksData(bankId).catch((error) => {
      console.log(error);
    });
    console.log(response);
    setBanksData(response);
  };

  useEffect(() => {
    if (bankId) {
      getBankData();
    }
  }, [bankId]);

  return (
    <div>
      <h1>Risk Assessment Form</h1>
      {banksData ? (
        banksData.codes?.map((code, index) => (
          <div key={index}>
            <p>{code.code}</p>
            <p>{code.riskCategory}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RiskAssementForm;
