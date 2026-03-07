"use client";

import dynamic from "next/dynamic";

const BudgetPlannerSheet = dynamic(
  () => import("@/components/BudgetPlannerSheet"),
  { ssr: false },
);

export default function BudgetPlannerSheetWrapper() {
  return <BudgetPlannerSheet />;
}
