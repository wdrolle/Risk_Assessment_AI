import TrainModel from "@/components/train-model";
import React from "react";

const Page = ({
  params,
}: {
  params: {
    bankId: string;
  };
}) => {
  return <TrainModel />;
};

export default Page;
