"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { assesment, bank, subcode } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getBanksData } from "@/lib/bankData";
import { addCodeAnalysis } from "@/lib/addCodeAnalysisToDB";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import React from "react";

const formSchema = z.object({
  CB: z.boolean().default(false).optional(),
  NRA: z.boolean().default(false).optional(),
  IA: z.boolean().default(false).optional(),
  EM: z.boolean().default(false).optional(),
  MSB: z.boolean().default(false).optional(),
  TP: z.boolean().default(false).optional(),
  IG: z.boolean().default(false).optional(),
  HR: z.boolean().default(false).optional(),
  HRL: z.boolean().default(false).optional(),
  EB: z.boolean().default(false).optional(),
  SV: z.boolean().default(false).optional(),
  CI: z.boolean().default(false).optional(),
  CTR: z.boolean().default(false).optional(),
  LC: z.boolean().default(false).optional(),
  CO: z.boolean().default(false).optional(),
  FC: z.boolean().default(false).optional(),
  FBAR: z.boolean().default(false).optional(),
  P: z.boolean().default(false).optional(),
  PB: z.boolean().default(false).optional(),
  ND: z.boolean().default(false).optional(),
  FT: z.boolean().default(false).optional(),
  CBW: z.boolean().default(false).optional(),
  ACH: z.boolean().default(false).optional(),
  MI: z.boolean().default(false).optional(),
  LOC_C: z.boolean().default(false).optional(),
  NP: z.boolean().default(false).optional(),
  S: z.boolean().default(false).optional(),
  SAR: z.boolean().default(false).optional(),
});

const RiskAssementForm = ({
  data,
  selectedBankID: bankId,
}: {
  data: {
    codes: {
      code: string;
      riskCategory: string;
      lowRisk: string;
      moderateRisk: string;
      highRisk: string;
      subcode?: [subcode];
    }[];
  };
  selectedBankID: string;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const [banksData, setBanksData] = useState<bank | {}>({});
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CB: false,
      NRA: false,
      IA: false,
      EM: false,
      MSB: false,
      TP: false,
      IG: false,
      HR: false,
      HRL: false,
      EB: false,
      SV: false,
      CI: false,
      CTR: false,
      LC: false,
      CO: false,
      FC: false,
      FBAR: false,
      P: false,
      PB: false,
      ND: false,
      FT: false,
      CBW: false,
      ACH: false,
      MI: false,
      LOC_C: false,
      NP: false,
      S: false,
      SAR: false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    setMessage("Parsing Data...");
    const serverUrl = "http://10.192.11.23:3000/analyze"; // Updated to the GPU server URL

    const requestData = {
      codes: [],
    };

    for (const [key, value] of Object.entries(values)) {
      if (value) {
        const filteredCodes = (banksData as bank)?.codes.filter(
          (code) => key === code.code
        );
        requestData["codes"].push(filteredCodes[0]);
      }
    }

    console.log("passed values:", requestData);

    for (const code of requestData.codes) {
      setMessage("📂Assessing your data...");
      setTimeout(() => {
        setMessage("🧠Analysing...");
      }, 30000);

      setTimeout(() => {
        setMessage("⌛ReChecking the Analysis...");
      }, 70000);

      const response = await axios.post(serverUrl, { bankId, code }).then((res) => {
        console.log(res.data);
        setMessage(`✅${code.code} code Analysis Complete`);
        const assessment: assesment = {
          code: code.code,
          comments: res.data.reasoning ? res.data.reasoning : "",
          documentUsedForAnalysis: res.data.documentUsedForAnalysis
            ? res.data.documentUsedForAnalysis
            : "",
          inherentRiskCategory: res.data.inherentRiskCategory
            ? res.data.inherentRiskCategory
            : "",
          inherentRiskScore: res.data.inherentRiskScore
            ? parseInt(res.data.inherentRiskScore)
            : 0,
          mitigatingControl: res.data.mitigatingControl ? res.data.mitigatingControl : "",
          mitigatingControlScore: res.data.mitigatingControlScore
            ? parseInt(res.data.mitigatingControlScore)
            : 0,
          residualRiskCategory: res.data.residualRiskCategory
            ? res.data.residualRiskCategory
            : "",
          residualRiskScore: res.data.residualRiskScore
            ? parseInt(res.data.residualRiskScore)
            : 0,
          bankId: bankId,
        };
        addCodeAnalysis(assessment).then((res) => {
          setMessage("Analysis Saved ☑️...");
          toast({
            title: "Uploaded Code Analysis",
            description: `${code.code} Code Analysis Successfully Done.`,
          });
          setIsProcessing(false);
          getBankData();
          router.refresh();
        });
      });
    }
  };

  const getBankData = async () => {
    setIsProcessing(true);
    setMessage("Loading Banks data...");

    const response = await getBanksData(bankId).catch((error) => {
      console.log(error);
    });

    console.log(response);
    setBanksData(response);
    setMessage("Loaded Successfully !!");

    setIsProcessing(false);
  };

  useEffect(() => {
    if (bankId) {
      getBankData();
    }
  }, [bankId]);

  return (
    <div>
      {(isLoading || isProcessing) && (
        <div className="z-10 fixed top-1/2 left-1/2 transform h-full w-full -translate-x-1/2 bg-opacity-80 bg-black text-2xl font-semibold -translate-y-1/2 flex items-center justify-center">
          <Loader2 className="h-[50px] w-[50px] text-white animate-spin mr-2" />
          <p className="text-[50px] text-white dark:text-zinc-400">{message}</p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col w-full p-4">
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
                {(banksData as bank)?.codes?.map((content, index) => {
                  const showMitigatingControls = form.watch(content.code);
                  const analysis = (banksData as bank)?.codeAnalyses.find(
                    (assessment) => assessment.code === content.code
                  );
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
                          {content.riskCategory.substring(0, 40)}...
                        </TableCell>
                        <TableCell className="align-top">
                          {content.lowRisk.substring(0, 40)}...
                        </TableCell>
                        <TableCell className="align-top">
                          {content.moderateRisk.substring(0, 40)}...
                        </TableCell>
                        <TableCell className="align-top">
                          {content.highRisk.substring(0, 40)}...
                        </TableCell>
                        <TableCell className="align-top">
                          {analysis?.inherentRiskCategory}
                        </TableCell>
                        <TableCell className="align-top">
                          {analysis?.inherentRiskScore}
                        </TableCell>
                      </TableRow>
                      {showMitigatingControls && (
                        <TableRow className="border-b-2">
                          <TableCell colSpan={7}>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Mitigating Control</TableHead>
                                  <TableHead>Mitigating Control Score</TableHead>
                                  <TableHead>Residual Risk Score</TableHead>
                                  <TableHead>Document Used</TableHead>
                                  <TableHead>Comments</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell>{analysis?.mitigatingControl}</TableCell>
                                  <TableCell>{analysis?.mitigatingControlScore}</TableCell>
                                  <TableCell>{analysis?.residualRiskScore}</TableCell>
                                  <TableCell>{analysis?.documentUsedForAnalysis}</TableCell>
                                  <TableCell>
                                    <Textarea
                                      rows={6}
                                      cols={6}
                                      className="w-[300px]"
                                      value={analysis?.comments}
                                    />
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col items-center">
            {(banksData as bank)?.codes?.length > 0 ? (
              <Button className="w-[100px] bg-blue-700 text-white hover:bg-blue-900 hover:text-white">
                Submit
              </Button>
            ) : (
              <div className="flex flex-col items-center justify-center gap-y-5 mt-3">
                <Button
                  type="button"
                  onClick={() => router.push("/codes/add-manage-codes")}
                  className="flex w-[100px] bg-blue-700 text-white hover:bg-blue-900 hover:text-white"
                >
                  Add codes
                </Button>
                <div className="flex">*Add Codes to start analysis</div>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RiskAssementForm;
