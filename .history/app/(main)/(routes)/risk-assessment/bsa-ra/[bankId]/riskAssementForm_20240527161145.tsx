"use client";
import React, { useEffect, useState } from "react";
import { bank } from "@/types";
import { getBanksData } from "@/lib/bankData";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const formSchema = z.object({
  CB: z.boolean().default(false).optional(),
  NRA: z.boolean().default(false).optional(),
  // Add other codes as needed
});

const code_names = ["CB", "NRA"];

const RiskAssementForm = ({ selectedBankID: bankId }: { selectedBankID: string }) => {
  const [banksData, setBanksData] = useState<bank | null>(null);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: code_names.reduce((acc, code) => {
      acc[code] = false;
      return acc;
    }, {} as { [key: string]: boolean }),
  });

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Risk Category</TableHead>
                <TableHead>Low Risk</TableHead>
                <TableHead>Moderate Risk</TableHead>
                <TableHead>High Risk</TableHead>
                <TableHead>Inherent Risk Category</TableHead>
                <TableHead>Inherent Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banksData ? (
                banksData.codes?.map((content, index) => {
                  const showMitigatingControls = form.watch(content.code);
                  return (
                    <React.Fragment key={index}>
                      <TableRow className="border-b-2">
                        <TableCell className="align-top">
                          <FormField
                            control={form.control}
                            name={content.code as keyof typeof formSchema._type}
                            render={({ field }) => (
                              <FormItem className="m-2 text-sm flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    id={`${content.code}`}
                                    className="mt-2"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="mt-4 mx-2 items-center flex justify-center">
                                  {content.code}
                                </FormLabel>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          {content.riskCategory}
                        </TableCell>
                      </TableRow>
                      {showMitigatingControls && (
                        <>
                          <TableRow className="border-b-2">
                            <TableCell colSpan={7} className="text-center font-semibold">
                              Mitigating Controls
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-b-2">
                            <TableCell colSpan={1}></TableCell>
                            <TableCell className="align-top">
                              {
                                (banksData as bank)?.codeAnalyses.filter(
                                  (assessment) =>
                                    assessment.code === content.code
                                )[0]?.mitigatingControl
                              }
                            </TableCell>
                            <TableCell className="align-top">
                              {
                                (banksData as bank)?.codeAnalyses.filter(
                                  (assessment) =>
                                    assessment.code === content.code
                                )[0]?.mitigatingControlScore
                              }
                            </TableCell>
                            <TableCell className="align-top">
                              {
                                (banksData as bank)?.codeAnalyses.filter(
                                  (assessment) =>
                                    assessment.code === content.code
                                )[0]?.residualRiskScore
                              }
                            </TableCell>
                            <TableCell className="align-top">
                              {
                                (banksData as bank)?.codeAnalyses.filter(
                                  (assessment) =>
                                    assessment.code === content.code
                                )[0]?.documentUsedForAnalysis
                              }
                            </TableCell>
                            <TableCell colSpan={2} className="align-top">
                              <Textarea
                                rows={6}
                                cols={6}
                                className="w-[300px]"
                                value={
                                  (banksData as bank)?.codeAnalyses.filter(
                                    (assessment) =>
                                      assessment.code === content.code
                                  )[0]?.comments
                                }
                              />
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <p>Loading...</p>
              )}
            </TableBody>
          </Table>
        </form>
      </Form>
    </div>
  );
};

export default RiskAssementForm;
