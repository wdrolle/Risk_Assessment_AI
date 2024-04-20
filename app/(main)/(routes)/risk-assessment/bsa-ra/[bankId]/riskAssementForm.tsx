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
import { assesment, bank } from "@/types";
import axios from "axios";
import { ArrowUpDown, Loader2 } from "lucide-react";
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

const formSchema = z.object({
  CB: z.boolean().default(false).optional(),
  NRA: z.boolean().default(false).optional(),
});

const code_names = ["CB", "NRA"];

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
    }[];
  };
  selectedBankID: string;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [banksData, setBanksData] = useState<bank>({
    id: "",
    name: "",
    address: "",
    codes: [
      {
        code: "",
        riskCategory: "",
        lowRisk: "",
        moderateRisk: "",
        highRisk: "",
      },
    ],
    codeAnalyses: [
      {
        code: "",
        comments: "",
        context: "",
        documentName: "",
        risk: "",
        riskRationale: "",
        score: 0,
        bankId: "",
      },
    ],
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CB: false,
      NRA: false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {

    setIsProcessing(true)
    setMessage("Parsing Data...")
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_PROCESSING_URL;

    data = {
      codes: [],
    };

    if (values.CB) {
      data["codes"].push(cbCode);
    }

    if (values.NRA) {
      data["codes"].push(nraCode);
    }

    console.log("passed values:", data);
    if (serverUrl) {
      setMessage("Assessing your data...")
      await axios
        .post(serverUrl, data)
        .then((response) => {
          console.log(response.data);

          if (bankId) {
            const analysisDataArray = response.data.map(
              (entry: {
                code: string;
                comments: string;
                context: string;
                documentName: string;
                risk: string;
                riskRationale: string;
                score: number;
              }) => ({ ...entry, bankId })
            );
            console.log(analysisDataArray);

            setMessage("Saving data to database...")
            analysisDataArray.forEach(async (analysisData: assesment) => {
              const url = queryString.stringifyUrl({
                url: `/api/addCodeAnalysisToMongoDB/`,
              });
              const response = await axios.post(url, analysisData);

              console.log("server response ", response);
              setMessage("Analysis is done Successfully!!")
            });
          }

          setIsProcessing(false)
        })
        .catch((error) => {
          console.error(error); // Handle errors
        });
    }
  };

  useEffect(() => {
    const getClients = async () => {
      setIsProcessing(true);
      setMessage("Loading Banks data...");
      await getBanksData(bankId)
        .then((response) => {
          setBanksData(response[0]);
          setMessage("Loaded Successfully !!");
          console.log(response[0]);
          setIsProcessing(false);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    if (bankId) {
      getClients();
    }
  }, [bankId]);

  return (
    <div>
      {(isLoading || isProcessing) && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
          <Loader2 className="h-7 w-7 text-zinc-500 animate-spin mr-2" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col w-full p-4">
            <Table>
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader>
                <TableRow>
                  {table_header.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}

                  <TableHead className="text-center">Risk SubClasses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table_content.map((content, index) => (
                  <TableRow key={index} className="border-b-2 ">
                    <TableCell className="align-top ">
                      <FormField
                        control={form.control}
                        name={(index === 0 && "CB") || "NRA"}
                        render={({ field }) => (
                          <FormItem className="m-2 text-sm flex items-center justify-center ">
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
                      {/* <Checkbox
                        id={`${content.code}_${content.risk_category}`}
                      />{" "} */}
                      {content.risk_category}
                    </TableCell>
                    <TableCell className="align-top">
                      {/* <Checkbox id={`${content.code}_${content.low_risk}`} />{" "} */}
                      {content.low_risk}
                    </TableCell>
                    <TableCell className="align-top">
                      {/* <Checkbox
                        id={`${content.code}_${content.moderate_risk}`}
                      />{" "} */}
                      {content.moderate_risk}
                    </TableCell>
                    <TableCell className="align-top">
                      {/* <Checkbox id={`${content.code}_${content.high_risk}`} />{" "} */}
                      {content.high_risk}
                    </TableCell>

                    <TableCell className="align-top"></TableCell>
                    <TableCell className="align-top"></TableCell>
                    <TableCell className="align-top">Example data</TableCell>
                    <TableCell className="align-top">Example data</TableCell>
                    <TableCell className="align-top">Example data</TableCell>
                    <TableCell className="align-top">Example data</TableCell>
                    <TableCell className="align-top">Example data</TableCell>
                    <TableCell>
                      {" "}
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
                                  {/* {sub_content.score} */}
                                </TableCell>
                                <TableCell className="align-top">
                                  {/* {sub_content.comments} */}
                                </TableCell>
                                <TableCell className="align-top">
                                  {/* {sub_content.documents} */}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col items-center">
            <Button className="w-[100px] bg-blue-700 text-white hover:bg-blue-900 hover:text-white">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RiskAssementForm;
