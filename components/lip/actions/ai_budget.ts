"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";

// Define the schema for the input
const budgetSchema = z.object({
  budget: z.number().min(1, "Budget must be at least $1"),
  days: z.number().min(1, "Days must be at least 1").max(30, "Max 30 days"),
  people: z.number().min(1, "People must be at least 1"),
});

export type BudgetState = {
  message: string;
  success: boolean;
  error?: {
    budget?: string[];
    days?: string[];
    people?: string[];
  };
  plan?: {
    meals: Array<{
      day: number;
      mealType: string;
      name: string;
      ingredients: string[];
    }>;
    matchedProducts: Array<{
      id: string;
      name: string;
      price: number;
      image: string;
    }>;
    totalCost: number;
    remainingBudget: number;
  };
};

export async function createBudgetPlan(
  prevState: BudgetState,
  formData: FormData,
): Promise<BudgetState> {
  const budget = Number(formData.get("budget"));
  const days = Number(formData.get("days"));
  const people = Number(formData.get("people"));

  // Validate inputs
  const validation = budgetSchema.safeParse({ budget, days, people });

  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      error: validation.error.flatten().fieldErrors,
    };
  }

  // 0. Fetch available products from DB to feed into AI
  // In a real app with thousands of products, you'd probably search using vector embeddings (RAG).
  // For this size, fetching all is fine.
  const availableProducts = await prisma.product.findMany({
    select: { id: true, name: true, price: true, category: true, image: true },
  });

  const productListString = availableProducts
    .map((p) => `- ${p.name} ($${Number(p.price).toFixed(2)})`)
    .join("\n");

  // Real AI Call
  try {
    const { createGroq } = await import("@ai-sdk/groq");
    const { generateText } = await import("ai");

    const groq = createGroq();
    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are an expert AI Budget Meal Planner.
            Your goal is to create a nutritious and delicious meal plan for ${people} people for ${days} days, STRICTLY adhering to a budget of $${budget} (or as close as possible).
            
            **CRITICAL**: You must ONLY use ingredients that are available in our store.
            Here is the list of available products:
            ${productListString}

            Guidelines:
            1. **Budget First**: Check the prices in the list. Do not exceed $${budget}.
            2. **Strict Inventory**: If a meal needs "Chicken" but we only have "Wild Caught Salmon", you must plan a Salmon meal or a vegetarian meal using available items (like Eggs/Quinoa). DO NOT invent ingredients.
            3. **Efficient**: Reuse ingredients across meals.
            4. **Shopping List**: The 'shoppingList' array must contain the EXACT names of the products from the provided list that are needed for the meals.

            You MUST respond with ONLY valid JSON (no markdown, no extra text) matching this exact schema:
            {
              "meals": [{ "day": number, "mealType": string, "name": string, "ingredients": [string] }],
              "shoppingList": [string]
            }`,
      prompt: `Create a plan for ${days} days for ${people} people with a max budget of $${budget}. Respond with ONLY valid JSON.`,
    });

    // Parse the JSON response from the AI
    const jsonText = result.text.replace(/```json\n?|```\n?/g, "").trim();
    const aiResponse = JSON.parse(jsonText) as {
      meals: {
        day: number;
        mealType: string;
        name: string;
        ingredients: string[];
      }[];
      shoppingList: string[];
    };

    // 2. Find products in DB based on shopping list (Exact match now since AI uses our names)
    const matchedProducts: {
      id: string;
      name: string;
      price: number;
      image: string;
      category: string;
    }[] = [];
    let totalCost = 0;

    for (const itemName of aiResponse.shoppingList) {
      // We can now do an exact match or extremely high confidence search
      const product = availableProducts.find((p) => p.name === itemName);

      if (product) {
        if (!matchedProducts.find((p) => p.id === product.id)) {
          matchedProducts.push({
            ...product,
            price: Number(product.price),
          });
          totalCost += Number(product.price);
        }
      } else {
        // Fallback for slight hallucinations
        const fuzzyProduct = await prisma.product.findFirst({
          where: { name: { contains: itemName, mode: "insensitive" } },
        });
        if (
          fuzzyProduct &&
          !matchedProducts.find((p) => p.id === fuzzyProduct.id)
        ) {
          matchedProducts.push({
            ...fuzzyProduct,
            price: Number(fuzzyProduct.price),
          });
          totalCost += Number(fuzzyProduct.price);
        }
      }
    }

    return {
      success: true,
      message: "Plan generated successfully!",
      plan: {
        meals: aiResponse.meals,
        matchedProducts,
        totalCost,
        remainingBudget: budget - totalCost,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("AI/DB Error:", message);
    return {
      success: false,
      message: `Error: ${message}`,
    };
  }
}
