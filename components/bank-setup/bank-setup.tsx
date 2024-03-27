"use client";
import { AuthUser } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { v4 } from "uuid";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { Button } from "../ui/button";
import Loader from "../global/loader";
import { createBank } from "@/lib/supabase/queries";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CreateBankFormSchema } from "@/lib/types";
import { z } from "zod";

import { Bank } from "@prisma/client";
import axios from "axios";

interface BankSetupProps {
  user: AuthUser;
}

const BankSetup: React.FC<BankSetupProps> = ({ user }) => {
  const { toast } = useToast();
  const router = useRouter();

  const supabase = createClientComponentClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isLoading, errors },
  } = useForm<z.infer<typeof CreateBankFormSchema>>({
    mode: "onChange",
    defaultValues: {
      address: "",
      bankName: "",
      files: [],
    },
  });

  useEffect(() => {}, []);

  const onSubmit: SubmitHandler<z.infer<typeof CreateBankFormSchema>> = async (
    value
  ) => {
    const bankUUID = v4();

    try {
      const newBank: Bank = {
        createdAt: new Date(),
        id: bankUUID,
        name: value.bankName,
        address: value.address,
        updatedAt: new Date(),
      };

      console.log(newBank, value.files && value.files[0]);
      const { data, error: createError } = await createBank(newBank);
      if (createError) {
        throw new Error();
      }

      toast({
        title: "Bank Created",
        description: `${newBank.name} has been created successfully.`,
      });

      // router.replace(`/dashboard/${data.id}`);
    } catch (error) {
      console.log(error, "Error");
      toast({
        variant: "destructive",
        title: "Could not create your bank",
        description:
          "Oops! Something went wrong, and we couldn't create your workspace. Try again or come back later.",
      });
    } finally {
      reset();
    }
  };

  return (
    <Card
      className="w-[800px]
      h-screen
      sm:h-auto
      shadow-xl
      bg-black
      text-white
  "
    >
      <CardHeader>
        <CardTitle>Upload Your Bank Information</CardTitle>
        <CardDescription>
          Lets upload your bank info to get you started.You can add only one
          bank info with one email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div
              className="flex
            items-center
            gap-4"
            >
              <div className="w-full ">
                <Label
                  htmlFor="workspaceName"
                  className="text-sm
                  text-muted-foreground
                  text-white
                "
                >
                  Name
                </Label>
                <Input
                  id="bankName"
                  type="text"
                  className="text-white"
                  placeholder="Bank Name"
                  disabled={isLoading}
                  {...register("bankName", {
                    required: "Workspace name is required",
                  })}
                />
                <small className="text-red-600">
                  {errors?.bankName?.message?.toString()}
                </small>
              </div>
            </div>

            <div>
              <Label
                htmlFor="logo"
                className="text-sm
                  text-muted-foreground
                  text-white
                "
              >
                Bank Address
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Bank Address"
                className="text-white"
                disabled={isLoading}
                {...register("address", {
                  required: "Bank Address is required",
                })}
              />
              <small className="text-red-600">
                {errors?.address?.message?.toString()}
              </small>
            </div>

            <div>
              <Label
                htmlFor="files"
                className="text-sm
                  text-muted-foreground
                  text-white
                "
              >
                Bank's Files
              </Label>
              <Input
                type="file"
                accept="application/pdf,application/vnd.ms-excel,.txt,.docx"
                className="text-black  mt-2 bg-white w-full"
                disabled={isLoading}
                multiple
                {...register("files", {
                  required:
                    "Bank Files are required for Training your ai model for better analysis",
                })}
                
              />
              <small className="text-red-600">
                {errors?.files?.message?.toString()}
              </small>
            </div>

            <div className="self-end">
              <Button disabled={isLoading} type="submit">
                {!isLoading ? "Create Bank" : <Loader />}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BankSetup;
