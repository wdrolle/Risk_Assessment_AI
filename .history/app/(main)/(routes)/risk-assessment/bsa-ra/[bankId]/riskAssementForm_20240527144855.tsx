import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { getBanksData } from "@/lib/bankData";
import { getAnalysis } from "@/lib/server-actions/ai-actions";
import { addCodeAnalysis } from "@/lib/addCodeAnalysisToDB";

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

const codeNames = [
  "CB",
  "NRA",
  "IA",
  "EM",
  "MSB",
  "TP",
  "IG",
  "HR",
  "HRL",
  "EB",
  "SV",
  "CI",
  "CTR",
  "LC",
  "CO",
  "FC",
  "FBAR",
  "P",
  "PB",
  "ND",
  "FT",
  "CBW",
  "ACH",
  "MI",
  "LOC_C",
  "NP",
  "S",
  "SAR",
];

const RiskAssessmentForm = ({ data, selectedBankID: bankId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [banksData, setBanksData] = useState({});
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: codeNames.reduce((acc, code) => {
      acc[code] = false;
      return acc;
    }, {}),
  });
  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values) => {
    setIsProcessing(true);
    setMessage("Parsing Data...");
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_PROCESSING_URL;

    const selectedCodes = codeNames.filter((code) => values[code]);
    const filteredCodes = (banksData.codes || []).filter((code) =>
      selectedCodes.includes(code.code)
    );

    data = { codes: filteredCodes };

    for (const code of data.codes) {
      setMessage("📂Assessing your data...");
      setTimeout(() => {
        setMessage("🧠Analysing...");
      }, 30000);
      setTimeout(() => {
        setMessage("⌛ReChecking the Analysis...");
      }, 70000);
      const res = await getAnalysis(bankId, code);
      console.log(res);
      setMessage(`✅${code.code} code Analysis Complete`);
      const assessment = {
        code: code.code,
        comments: res.reasoning || "",
        documentUsedForAnalysis: res.documentUsedForAnalysis || "",
        inherentRiskCategory: res.inherentRiskCategory || "",
        inherentRiskScore: parseInt(res.inherentRiskScore) || 0,
        mitigatingControl: res.mitigatingControl || "",
        mitigatingControlScore: parseInt(res.mitigatingControlScore) || 0,
        residualRiskCategory: res.residualRiskCategory || "",
        residualRiskScore: parseInt(res.residualRiskScore) || 0,
        bankId: bankId,
      };
      await addCodeAnalysis(assessment);
      setMessage("Analysis Saved ☑️...");
      toast({
        title: "Uploaded Code Analysis",
        description: `${code.code} Code Analysis Successfully Done.`,
      });
      setIsProcessing(false);
      getBankData();
      router.refresh();
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
                  <TableHead>Mitigating Control</TableHead>
                  <TableHead>Mitigating Control Score</TableHead>
                  <TableHead>Residual Risk Score</TableHead>
                  <TableHead>Document Used</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>SubClasses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(banksData.codes || []).map((content, index) => {
                  const showMitigatingControls = form.watch(content.code);
                  return (
                    <React.Fragment key={index}>
                      <TableRow className="border-b-2">
                        <TableCell className="align-top">
                          <FormField
                            control={form.control}
                            name={content.code}
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
                          {
                            (banksData.codeAnalyses || []).find(
                              (assessment) => assessment.code === content.code
                            )?.inherentRiskCategory
                          }
                        </TableCell>
                        <TableCell className="align-top">
                          {
                            (banksData.codeAnalyses || []).find(
                              (assessment) => assessment.code === content.code
                            )?.inherentRiskScore
                          }
                        </TableCell>
                      </TableRow>
                      {showMitigatingControls && (
                        <TableRow key={`${index}-mc`} className="border-b-2">
                          <TableCell colSpan={7}></TableCell>
                          <TableCell className="align-top">
                            {
                              (banksData.codeAnalyses || []).find(
                                (assessment) => assessment.code === content.code
                              )?.mitigatingControl
                            }
                          </TableCell>
                          <TableCell className="align-top">
                            {
                              (banksData.codeAnalyses || []).find(
                                (assessment) => assessment.code === content.code
                              )?.mitigatingControlScore
                            }
                          </TableCell>
                          <TableCell className="align-top">
                            {
                              (banksData.codeAnalyses || []).find(
                                (assessment) => assessment.code === content.code
                              )?.residualRiskScore
                            }
                          </TableCell>
                          <TableCell className="align-top">
                            {
                              (banksData.codeAnalyses || []).find(
                                (assessment) => assessment.code === content.code
                              )?.documentUsedForAnalysis
                            }
                          </TableCell>
                          <TableCell className="align-top w-[600px]">
                            <Textarea
                              rows={6}
                              cols={6}
                              className="w-[300px]"
                              value={
                                (banksData.codeAnalyses || []).find(
                                  (assessment) =>
                                    assessment.code === content.code
                                )?.comments
                              }
                            />
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell colSpan={13}>
                          <Table className="h-full overflow-scroll">
                            <TableHeader>
                              <TableRow className="bg-black text-white">
                                <TableHead>#</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Strong(3)</TableHead>
                                <TableHead>Adequate(2)</TableHead>
                                <TableHead>Weak(1)</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Comments</TableHead>
                                <TableHead>Documents</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {content.subclasses?.map((subcode, index) => (
                                <TableRow key={index}>
                                  <TableCell className="align-top">
                                    {subcode.subcode}
                                  </TableCell>
                                  <TableCell className="align-top">
                                    {subcode.category}
                                  </TableCell>
                                  <TableCell className="align-top">
                                    {subcode.strong}
                                  </TableCell>
                                  <TableCell className="align-top">
                                    {subcode.adequate}
                                  </TableCell>
                                  <TableCell className="align-top">
                                    {subcode.weak}
                                  </TableCell>
                                  <TableCell className="align-top">
                                    {subcode.score}
                                  </TableCell>
                                  <TableCell className="align-top">
                                    {subcode.comments}
                                  </TableCell>
                                  <TableCell className="align-top">
                                    {subcode.documents}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col items-center">
            {(banksData.codes || []).length > 0 ? (
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

export default RiskAssessmentForm;
