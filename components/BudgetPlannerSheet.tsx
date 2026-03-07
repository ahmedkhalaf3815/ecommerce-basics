"use client";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import BudgetPlanner from "./BudgetPlanner";

const BudgetPlannerSheet = () => {
  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50",
        )}
      >
        <Bot className="h-4 w-4" />
        Ask AI Budget Planner{" "}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>AI Budget Planner</SheetTitle>
          <SheetDescription>
            Tell us your budget and we&apos;ll create a personalized meal plan
            for you.{" "}
          </SheetDescription>
        </SheetHeader>
        {/* <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div> */}
        <BudgetPlanner />
      </SheetContent>
    </Sheet>
  );
};

export default BudgetPlannerSheet;
