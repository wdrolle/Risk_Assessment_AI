import { prompt_example ,create_prompt} from "@/models/prompt_structure";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){

    try {

        // const code_data= {code: "NRA",
        // riskCategory: "NRA Customers",
        // lowRisk: "The institution does not have any NRA accounts.",
        // moderateRisk:
        //   "Moderate level of NRA accounts from lower- risk geographies.",
        // highRisk:
        //   "Significant number of NRA accounts from higher-risk geographies.",}
        const body = await req.json();
        const prompt=create_prompt(body.code)
        console.log("body:",body) 
        const res = await axios
        .post("http://localhost:11434/api/generate", {
          model: body.model,
          prompt: prompt,
          stream:body.stream,
          options: body.options,
        })
    
        const data = await res.data
        console.log(data)
        
        return  NextResponse.json({data});
    } catch (error) {
        console.log(error)
        return  NextResponse.json(null);
    }
}