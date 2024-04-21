import { code } from "@/types";

export const prompt_example = `Code that you have to analyze is : { code : "CB" , risk_category: "Customer Base" , Low Risk Criteria : "Stable homogenous community bank, customers are predominately consumers." , Moderate_Risk_criteria : "Customer base increasing due to branching, merger, or acquisition. Customer base is regional." , High_risk_criteria:"Customer base derived from doing business in high risk geographic locations (domestic and foreign) or a diverse metropolitan area." } . Now if the given context have information then provide the response in this format :{ inherent risk: (low|moderate|high) , inherent_risk_score:(1|2|3), mitigating_control:(low|moderate|high) , mititgating_control_score:(1|2|3),Document_used_for_analysis,specific_part,page_number_of_specific_part}. Document_used_for_analysis meaning  the document name used for analysis ,Sepcific_part meaning the information about sepecfic part of the document used for analysis and at last page_no_specific_part meaning  the page number from the document from which the specific part belongs to in Whole Number. Exmple Response for your understanding ,{ inherent risk: moderate , inherent_risk_score: 2 , mitigating_control: high ,mitigating_control_score: 3 , Document_used_for_analysis: AML Compliance Program;Specific_part: Section 4.e (Joint Filing of SARs with Other Financial Institutions) ,Page_number_of_specific_part: 14} Reasoning: The inherent risk is moderate because the customer base is increasing due to branching, merger, or acquisition, and the customer base is regional. This could increase the likelihood of suspicious transactions. However, the mitigating control score is high because the bank has an AML compliance program that includes training for employees on identifying red flags and signs of money laundering, as well as independent review of the program by a third-party service provider (SIRS). This suggests that the bank has taken steps to mitigate the risks associated with its increasing customer base. The specific part from Section 4.e (Joint Filing of SARs with Other Financial Institutions) is relevant because it shows that the bank has a process in place for jointly filing SARs with other financial institutions, which could help identify and report suspicious transactions. }`;

export const create_prompt = (code: code) => {
  return `Code that you have to analyze is : ${code} . Now if the given context have information then provide the response in this format :{ inherent risk: (low|moderate|high) , inherent_risk_score:(1|2|3), mitigating_control:(low|moderate|high) , mititgating_control_score:(1|2|3),Document_used_for_analysis,specific_part,page_number_of_specific_part}. Document_used_for_analysis meaning  the document name used for analysis ,Sepcific_part meaning the information about sepecfic part of the document used for analysis and at last page_no_specific_part meaning  the page number from the document from which the specific part belongs to in Whole Number. Exmple Response for your understanding ,{ inherent risk: moderate , inherent_risk_score: 2 , mitigating_control: high ,mitigating_control_score: 3 , Document_used_for_analysis: AML Compliance Program;Specific_part: Section 4.e (Joint Filing of SARs with Other Financial Institutions) ,Page_number_of_specific_part: 14} Reasoning: The inherent risk is moderate because the customer base is increasing due to branching, merger, or acquisition, and the customer base is regional. This could increase the likelihood of suspicious transactions. However, the mitigating control score is high because the bank has an AML compliance program that includes training for employees on identifying red flags and signs of money laundering, as well as independent review of the program by a third-party service provider (SIRS). This suggests that the bank has taken steps to mitigate the risks associated with its increasing customer base. The specific part from Section 4.e (Joint Filing of SARs with Other Financial Institutions) is relevant because it shows that the bank has a process in place for jointly filing SARs with other financial institutions, which could help identify and report suspicious transactions. }`;
};

export const create_model = (context: string) => {
  return `FROM llama3
  TEMPLATE """
  
  {{ if .System }}<|start_header_id|>system<|end_header_id|>
  
  {{ .System }}<|eot_id|>{{ end }}{{ if .Prompt }}<|start_header_id|>prompt<|end_header_id|>
  
  {{ .Prompt }}<|eot_id|>{{ end }}<|start_header_id|>assistant<|end_header_id|>
  
  {{ .Response }}<|eot_id|>
  """
  
  SYSTEM """You are an Ai , whose job is to analyze the inherent risks of a banking system . First user_prompt given to you is the context of data that you will use to analyze the banking system and paired input will have information about the risk code that you have to analyze . Write a response that appropriately completes the request.  And while giving response don't provide any additional data, if the context doesn't have data reuired for analysis of code then simply say provided data is not suffiecient for this code analysis , And your response should contain Inherent Risk Category , Inherent Risk Score , Mitigating controls , mitigating control score , Document Name used for analysis , specific part of context used in analaysis and page Number of that specific part used.
  
  Context : {{${context}}}
  
  """
  
  # Set parameters
  
  PARAMETER stop "<|start_header_id|>"
  PARAMETER stop "<|end_header_id|>"
  PARAMETER stop "<|eot_id|>"
  PARAMETER num_predict 5000
  PARAMETER num_ctx 20000`;
};
