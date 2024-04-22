"use server";
import { Bank } from "@prisma/client";
import { db } from "../db";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 } from "uuid";
import { code, codes } from "@/types";

export const getBank = async (email: string) => {
  try {
    const bank = await db.bank.findFirst({
      where: {
        users: {
          some: { email: email },
        },
      },
    });

    return bank;
  } catch (error) {
    console.log("[ERROR_GET_BANK]", error);
    return null;
  }
};

export const createAndUpdateBank = async (newbank: Partial<Bank>) => {
  cookies().getAll();
  console.log("in create");
  const supabase = await createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  try {
    const bankData = await db.bank.upsert({
      where: {
        id: newbank.id,
      },
      update: newbank,
      create: {
        id: newbank.id,
        name: newbank.name ? newbank.name : "",
        address: newbank.address ? newbank.address : "",
        status: newbank.status ? newbank.status : "",
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return { data: bankData, error: null };
  } catch (error: any) {
    console.log("[CREATE_BANK_ERROR]", error);
    return { data: null, error: error.message };
  }
};

interface uploadBankFilesProps {
  id: string;
  embedded_till: number;
  filename: string;
  file_url: string;
  updatedAt: Date;
  bankId: string;
}
export const uploadBankFiles = async (
  files: Partial<uploadBankFilesProps>[]
) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const fileUploaded = await db.file.upsert({
        where: {
          id: file.id ?? "",
        },
        update: { ...file, filename: file.filename },
        create: {
          id: v4(),
          filename: file.filename ? file.filename : "",
          file_url: file.file_url ? file.file_url : "",
          embedded_till: 0,
          upadatedAt: new Date().toISOString().toLocaleString(),
          bankId: file.bankId ? file.bankId : "",
        },
      });
    } catch (error) {
      console.log("[ERROR_UPLOAD_BANK_FILES]", error);
    }
  }

  const fileUploadedSuccessfully = await createAndUpdateBank({
    id: files[0].bankId ? files[0].bankId : "",
    status: "files_uploaded",
  });
};

export const getBankWithId = async (bankId: string) => {
  try {
    const bank = await db.bank.findFirst({
      where: {
        id: bankId,
      },
    });

    return bank;
  } catch (error) {
    console.log("[ERROR_GET_BANK_WTTH_ID]", error);
    return null;
  }
};

export const deleteCodeWithBankId = async (bankId: string, code: string) => {
  try {
    const codeData = await db.code.deleteMany({
      where: {
        bankId: bankId,
        code: code,
      },
    });

    return codeData;
  } catch (error) {
    console.log("[ERROR_DELETE_CODE_WITH_BANKID]", error);
    return null;
  }
};

export const addCodes = async ({
  codes,
  bankId,
}: {
  codes: codes;
  bankId: string;
}) => {
  try {
    const bank = await db.bank.update({
      where: {
        id: bankId,
      },
      data: {
        codes: {
          create: codes.map((code: code) => ({
            code: code.code,
            riskCategory: code.riskCategory,
            lowRisk: code.lowRisk,
            moderateRisk: code.moderateRisk,
            highRisk: code.highRisk,
          })),
        },
      },
      include: {
        codes: true, // Include associated codes in the response
      },
    });

    return bank;
  } catch (error) {
    console.log("[ERROR_IN_ADD_CODE]", error);
    return null;
  }
};

export const getCodesWithId = async (bankId: string) => {
  try {
    const codes = await db.code.findMany({
      where: {
        bankId: bankId,
      },
    });
    if (codes) {
      const codeData = codes.map((code, index) => {
        return {
          code: code.code,
          riskCategory: code.riskCategory,
          lowRisk: code.lowRisk,
          moderateRisk: code.moderateRisk,
          highRisk: code.highRisk,
        };
      });

      return codeData;
    } else {
      return [];
    }
  } catch (error) {
    console.log("[ERROR_GET_CODES_WITH_ID]", error);
  }
};

export const getFilesByBankId = async (bankId: string) => {
  try {
    const files = await db.file.findMany({
      where: {
        bankId: bankId,
      },
    });
    
    return files;
  } catch (error) {
    return null;
    console.log("[ERROR_GET_FILES_BY_BANK_ID]", error);
  }
};
