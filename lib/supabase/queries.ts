import { Bank } from "@prisma/client";


export const createBank = async (newbank: Bank) => {
  console.log(newbank);
  
  return { data: { id: "jkfvkjbkjbjv" }, error: null };
};

