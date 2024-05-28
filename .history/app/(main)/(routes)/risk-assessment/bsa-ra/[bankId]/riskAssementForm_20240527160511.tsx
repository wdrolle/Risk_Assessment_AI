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
import { assesment, bank, code, codeAnalyses, codes, subcode } from "@/types";
import axios from "axios";
import { ArrowUpDown, Loader2, Router } from "lucide-react";
import queryString from "query-string";
import {
  cbCode,
  nraCode,
  table_content,
  table_header,
} from "@/constant/riskAssesmentTableData";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getBanksData } from "@/lib/bankData";
import { getCodesWithId } from "@/lib/supabase/queries";
import { getAnalysis } from "@/lib/server-actions/ai-actions";
import { addCodeAnalysis } from "@/lib/addCodeAnalysisToDB";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

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

const code_names = [
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
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_PROCESSING_URL;

    data = {
      codes: [],
    };

    for (const [key, value] of Object.entries(values)) {
      if (value) {
        const filteredCodes = (banksData as bank)?.codes.filter(
          (code) => key === code.code
        );
        data["codes"].push(filteredCodes[0]);
      }
    }

    console.log("passed values:", data);

    for (const code of data.codes) {
      setMessage("📂Assessing your data...");
      setTimeout(() => {
        setMessage("🧠Analysing...");
      }, 30000);

      setTimeout(() => {
        setMessage("⌛ReChecking the Analysis...");
      }, 70000);
      getAnalysis(bankId, code).then((res) => {
        console.log(res);
        setMessage(`✅${code.code} code Analysis Complete`);
        const assessment: assesment = {
          code: code.code,
          comments: res.reasoning ? res.reasoning : "",
          documentUsedForAnalysis: res.documentUsedForAnalysis
            ? res.documentUsedForAnalysis
            : "",
          inherentRiskCategory: res.inherentRiskCategory
            ? res.inherentRiskCategory
            : "",
          inherentRiskScore: res.inherentRiskScore
            ? parseInt(res.inherentRiskScore)
            : 0,
          mitigatingControl: res.mitigatingControl ? res.mitigatingControl : "",
          mitigatingControlScore: res.mitigatingControlScore
            ? parseInt(res.mitigatingControlScore)
            : 0,
          residualRiskCategory: res.residualRiskCategory
            ? res.residualRiskCategory
            : "",
          residualRiskScore: res.residualRiskScore
            ? parseInt(res.residualRiskScore)
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
      <h1>Risk Assessment Form</h1>
      {banksData && banksData.codes ? (
        banksData.codes.map((code, index) => (
          <div key={index}>
            <p>{code.code}</p>
            <p>{code.riskCategory}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
);
export default RiskAssementForm;

/* <Table className="h-full overflow-scroll">
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
                          {content.sub_category_content.map(
                            (sub_content, index) => (
                              <TableRow key={index}>
                                <TableCell className="align-top">
                                  {sub_content.code}
                                </TableCell>
                                <TableCell className="align-top">
                                  {sub_content.category}
                                </TableCell>
                                <TableCell className="align-top">
                                  {sub_content.strong}
                                </TableCell>
                                <TableCell className="align-top">
                                  {sub_content.adequate}
                                </TableCell>
                                <TableCell className="align-top">
                                  {sub_content.weak}
                                </TableCell>
                                <TableCell className="align-top">
//                                   {/* {sub_content.score} */
// }
//           </TableCell>
//           <TableCell className="align-top">
//             {/* {sub_content.comments} */}
//           </TableCell>
//           <TableCell className="align-top">
//             {/* {sub_content.documents} */}
//           </TableCell>
//         </TableRow>
//       )
//     )}
//   </TableBody>
// </Table> */}
