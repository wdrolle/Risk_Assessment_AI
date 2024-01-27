"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { json } from "stream/consumers";

const table_content = [
  {
    code: "CB",
    risk_category: "Customer Base",
    low_risk:
      "Stable homogenous community bank, customers are predominately consumers.",
    moderate_risk:
      "Customer base increasing due to branching, merger, or acquisition. Customer base is regional.",
    high_risk:
      "Customer base derived from doing business in high risk geographic locations (domestic and foreign) or a diverse metropolitan area.",
    sub_category_content: [
      {
        code: "CB-1",
        category: "Policy/Procedures",
        strong:
          "Policy / Procedures are thorough, detailed and updated as necessary to reflect changes to the bank’s customer base.",
        adequate:
          "Policy / Procedures are adequate however, have not been updated to reflect changes to the bank’s customer base.",
        weak: "Policy / Procedures do not exist or are significantly incomplete. ",
        score: "2",
        comments: "",
        documents: "",
      },
      {
        code: "CB-2",
        category: "CIP Documentary / Non-Documentary Verification",
        strong:
          "The CIP verification process adequately verifies customers within a reasonable time after account opening. The process is well- tracked and exceptions are followed up in a timely manner. ",
        adequate:
          "The CIP verification process is adequate, yet the exception process is poorly tracked and follow-up is not conducted in a timely manner. Exception process is poorly tracked and follow up is not timely.",
        weak: "The CIP verification process does not allow for verification of customers within a reasonable time. ",
        score: "1",
        comments: "",
        documents: "",
      },
    ],
  },
  {
    code: "NRA",
    risk_category: "NRA Customers",
    low_risk: "The institution does not have any NRA accounts.",
    moderate_risk:
      "Moderate level of NRA accounts from lower- risk geographies.",
    high_risk:
      "Significant number of NRA accounts from higher-risk geographies.",
    sub_category_content: [
      {
        code: "NRA-1",
        category: "Overseas Verification Controls",
        strong:
          "Procedures for account witnessing with overseas verification is thorough and detailed. Local approval is required prior to account opening.",
        adequate:
          "Procedures are adequate, however, they have not been updated to reflect the risk posed by account witnessed with overseas verification. Approval is not required by the BSA Team prior to account opening.",
        weak: "Procedures for account witnessing with overseas verification do not exist.",
        score: "1",
        comments: "",
        documents: "",
      },
    ],
  },
];

const page = () => {
  const [isMounted, setIsMounted] = useState(false);

  const data = {
    codes: [
      {
        code: "NRA",
        riskCategory: "NRA customers",
        lowRisk: "The institution does not have any NRA accounts.",
        moderateRisk:
          "Moderate level of NRA accounts from lower-risk geographies",
        highRisk:
          "Significant number of NRA accounts from higher-risk geographies",
      },
      {
        code: "CB",
        riskCategory: "Customer Base",
        lowRisk:
          "Stable homogenous community bank, customers are predominately consumers.",
        moderateRisk:
          "The customer base is increasing due to branching, mergers, or acquisitions. The customer base is regional.",
        highRisk:
          "The customer base is derived from doing business in high-risk geographic locations (domestic and foreign) or a diverse metropolitan area.",
      },
    ],
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async () => {
    await axios
      .post("http://localhost:8110/processData/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data); // Handle successful response
      })
      .catch((error) => {
        console.error(error); // Handle errors
      });
  };

  if (!isMounted) return null;

  return (
    <div className="m-4 border-2 w-full  flex flex-col p-2">
      <div className="flex w-full border-b-2 p-4">
        <h1>BSA-RA</h1>
      </div>

      <div className="flex w-full  p-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-xl">Clients</SelectLabel>
              <SelectItem value="userIdofj.wallacebank">
                J.Wallace Bank
              </SelectItem>
              <SelectItem value="userIdofj.wallacebank1">
                J.Wallace Bank 1
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col w-full p-4">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>
                Code <ArrowUpDown />
              </TableHead>
              <TableHead>
                Risk Category <ArrowUpDown />
              </TableHead>
              <TableHead>
                Low Risk <ArrowUpDown />
              </TableHead>
              <TableHead>
                Moderate Risk <ArrowUpDown />
              </TableHead>
              <TableHead>
                High Risk <ArrowUpDown />
              </TableHead>
              <TableHead>Inherent Risk</TableHead>
              <TableHead>Inherent Risk Score</TableHead>
              <TableHead>Migrating Control</TableHead>
              <TableHead>Migrating Control Score</TableHead>
              <TableHead>Residual Risk</TableHead>
              <TableHead>Category #</TableHead>
              <TableHead>Row in FFIEC Appendix M</TableHead>
              <TableHead className="text-center">Risk SubClasses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table_content.map((content, index) => (
              <TableRow key={index} className="border-b-2 ">
                <TableCell className="align-top">{content.code}</TableCell>
                <TableCell className="align-top">
                  {content.risk_category}
                </TableCell>
                <TableCell className="align-top">
                  <Checkbox id={`${content.code}_${content.low_risk}`} />{" "}
                  {content.low_risk}
                </TableCell>
                <TableCell className="align-top">
                  <Checkbox id={`${content.code}_${content.moderate_risk}`} />{" "}
                  {content.moderate_risk}
                </TableCell>
                <TableCell className="align-top">
                  <Checkbox id={`${content.code}_${content.high_risk}`} />{" "}
                  {content.high_risk}
                </TableCell>
                <TableCell className="align-top">Example data</TableCell>
                <TableCell className="align-top">Example data</TableCell>
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
                              {sub_content.score}
                            </TableCell>
                            <TableCell className="align-top">
                              {sub_content.comments}
                            </TableCell>
                            <TableCell className="align-top">
                              {sub_content.documents}
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
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </div>
      <div className="flex flex-col items-center">
        <Button
          onClick={handleSubmit}
          className="w-[100px] bg-blue-700 text-white hover:bg-blue-900 hover:text-white"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default page;
