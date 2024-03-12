export const table_content = [
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

export const table_header = [
  "Code",
  "Risk Category",
  "Low Risk",
  "Moderate Risk",
  "High Risk",
  "Inherent Risk",
  "Inherent Risk Score",
  "Migrating Control",
  "Migrating Control Score",
  "Residual Risk",
  "Category #",
  "Row in FFIEC Appendix M",
];

export const cbCode = {
  code: "CB",
  riskCategory: "Customer Base",
  lowRisk:
    "Stable homogenous community bank, customers are predominately consumers.",
  moderateRisk:
    "Customer base increasing due to branching, merger, or acquisition. Customer base is regional.",
  highRisk:
    "Customer base derived from doing business in high risk geographic locations (domestic and foreign) or a diverse metropolitan area.",
};

export const nraCode = {
  code: "NRA",
  riskCategory: "NRA Customers",
  lowRisk: "The institution does not have any NRA accounts.",
  moderateRisk: "Moderate level of NRA accounts from lower- risk geographies.",
  highRisk: "Significant number of NRA accounts from higher-risk geographies.",
};
