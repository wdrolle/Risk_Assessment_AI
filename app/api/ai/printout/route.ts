import { create_print_out_prompt } from "@/models/prompt_structure";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    // const code_data= {code: "NRA",
    // riskCategory: "NRA Customers",
    // lowRisk: "The institution does not have any NRA accounts.",
    // moderateRisk:
    //   "Moderate level of NRA accounts from lower- risk geographies.",
    // highRisk:
    //   "Significant number of NRA accounts from higher-risk geographies.",}
    const body = await req.json();

    const res = await axios.post("http://localhost:11434/api/generate", {
      model: "AnalysisPrintOut",
      prompt: body.prompt,
      stream: false,
      options: { num_ctx: 10000, temperature: 0 },
    });

    const data = await res.data;
    const response = data.response;

    fs.writeFileSync(
      `public/files/${body.bankName.replaceAll(" ", "")}_PrintOut.txt`,
      response
    );
    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();
    // add your content to the document here, as usual
    doc.text(response);
    // get a blob when you're done
    doc.pipe(fs.createWriteStream(`public/files/${body.bankName.replaceAll(" ", "")}_PrintOut.pdf`));
    doc.end();
    // console.log(data);

    return NextResponse.json({ response });
  } catch (error) {
    console.log(error);
    return NextResponse.json(null);
  }
}
