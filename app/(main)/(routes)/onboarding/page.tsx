import BankSetup from "@/components/bank-setup/bank-setup";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  cookies().getAll();
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect(`/login`);

  return (
    <div
      className="bg-background
        h-screen
        w-screen
        flex
        justify-center
        items-center
  "
    >
      <BankSetup user={user} />
    </div>
  );
};

export default Page;
