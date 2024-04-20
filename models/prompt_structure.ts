import { code } from "@/types";

export const prompt_example = `Code that you have to analyze is : { code : "CB" , risk_category: "Customer Base" , Low Risk Criteria : "Stable homogenous community bank, customers are predominately consumers." , Moderate_Risk_criteria : "Customer base increasing due to branching, merger, or acquisition. Customer base is regional." , High_risk_criteria:"Customer base derived from doing business in high risk geographic locations (domestic and foreign) or a diverse metropolitan area." } . Now if the given context have information then provide the response in this format :{ inherent risk: (low|moderate|high) , inherent_risk_score:(1|2|3), mitigating_control:(low|moderate|high) , mititgating_control_score:(1|2|3), Document_used_for_analysis:,Sepcific part of context used for analysis:, page_no_specific_part:}`;

export const create_prompt = (code: code) => {
  return `Code that you have to analyze is : ${code} . Now if the given context have informatiothe regory: (low|moderate|high) , inherent_risk_score:(1|2|3), mitigating_control:(low|moderate|high) , mititgating_control_score:(1|2|3), Document_used_for_analysis:...,Sepcific part of context used for analysis:..., page_no_specific_part:....`;
};
