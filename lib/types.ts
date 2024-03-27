import { z } from "zod";

export const FormSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  password: z.string().describe("Password").min(1, "Password is required"),
});

export const CreateBankFormSchema = z.object({
  bankName: z
    .string()
    .describe("Bank Name")
    .min(1, "Bank name must be min of 1 character"),
  address: z
    .string()
    .describe("Bank Address")
    .min(1, "Bank name must be min of 1 character"),
  files: z.array(z.string()).describe("Upload Banks Data").optional(),
});
