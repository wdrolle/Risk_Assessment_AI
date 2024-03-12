import { db } from "@/lib/db";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import BankSetup from "@/components/bank-setup/bank-setup"

const DashBoard = async () => {
  cookies().getAll();
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const bank = await db.bank.findFirst({
    where: {
      users: {
        some: { email: user.email },
      },
    },
  });

  console.log(bank);
  if (!bank)
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
        <BankSetup
          user={user}
          
        />
      </div>
    );

  redirect(`/dashboard/${bank.id}`);
};

export default DashBoard;
