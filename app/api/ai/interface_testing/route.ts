import { prompt_example, create_prompt } from "@/models/prompt_structure";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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

    console.log("body:", body);
    const res = await axios.post("http://localhost:3000/api/testing", {
      model: body.model,
      code: body.code,
      stream: body.stream,
      previous_analysis: body.previous_analysis,
    });

    const data = await res.data;
    const response = data.response;
    // console.log(data);

    return NextResponse.json({ response });
  } catch (error) {
    console.log(error);
    return NextResponse.json(null);
  }
}
