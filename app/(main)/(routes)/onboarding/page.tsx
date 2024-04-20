import BankSetup from "@/components/bank-setup/bank-setup";
import { db } from "@/lib/db";
import { getBank } from "@/lib/supabase/queries";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  cookies().getAll();
  const supabase = await createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const bank = await getBank(user?.email!!);

  if (bank) {
    if (bank.status === "files_uploaded")
      return redirect(`/dashboard/?${bank.id}`);
  }

  return (
    <div
      className="bg-background
        h-screen
        w-screen
        flex
        flex-col
        justify-center
        items-center
        gap-y-10
        "
    >
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold">OnBoarding</div>
        <div className="text-lg">
          The process of onboarding can take some mins{" "}
        </div>
      </div>
      <BankSetup bank={bank} />
      <div className="flex flex-col items-center">
        <div className="text-lg">
          *You will be notified by email when the onboarding process is
          completed{" "}
        </div>
      </div>
    </div>
  );
};

export default Page;
