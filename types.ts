export type assesment = {
  code: string;
  comments: string;
  context: string;
  documentName: string;
  risk: string;
  riskRationale: string;
  score: number;
  bankId: string;
};

export type code = {
  code: string;
  riskCategory: string;
  lowRisk: string;
  moderateRisk: string;
  highRisk: string;
};

export type codeAnalyses = [assesment];

export type bank = {
  id: string;
  name: string;
  address: string;
  codes: codes;
  codeAnalyses: codeAnalyses;
};

export type customers = {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type codes = [code];
