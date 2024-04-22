"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import RiskAssementForm from "./riskAssementForm";
import { useEffect, useState } from "react";
import { getBanksData } from "@/lib/bankData";
import { code, customers } from "@/types";
import { Loader2 } from "lucide-react";
import { getCodesWithId } from "@/lib/supabase/queries";

const page = ({
  params,
}: {
  params: {
    bankId: string;
  };
}) => {
  const [banks, setBanks] = useState<customers[]>([]);
  const [selectedBankID, setSelectedBankID] = useState("");
  const [IsMounted, setIsMounted] = useState(false);
  const [codes, setCodes] = useState<code[]>([]);
  const [isfetching, setIsfetching] = useState(true);

  useEffect(() => {
    const fetchCodes = async () => {
      setIsfetching(true);
      const codesData = await getCodesWithId(params.bankId);
      if (codesData) setCodes(codesData);
      setIsfetching(false);
    };
    fetchCodes();
  }, [codes, params.bankId]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const getClients = async () => {
      await getBanksData()
        .then((response) => {
          setBanks(response);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getClients();
  }, [banks]);

  // const handleCustomer = (value: string) => {
  //   setSelectedBankID(value);
  // };

  if (!IsMounted) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
        <Loader2 className="h-7 w-7 text-white animate-spin mr-2" />
        <p className="text-xs text-white dark:text-zinc-400">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="m-4 border-2 w-full  flex flex-col p-2">
      <div className="flex w-full border-b-2 p-4">
        <h1>BSA-RA</h1>
      </div>

      {/* <div className="flex w-full  p-4">
        <Select onValueChange={handleCustomer}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-xl">Clients</SelectLabel>

              {banks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}

      <RiskAssementForm
        data={{ codes: codes }}
        selectedBankID={params.bankId}
      />
    </div>
  );
};

export default page;
