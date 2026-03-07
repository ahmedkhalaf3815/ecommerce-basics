"use client";

import React, { useState, useTransition } from "react";
import { addToCart } from "./lip/actions/cart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Check, Loader2, ShoppingCart, ShoppingCartIcon } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const AddToCartButton = ({
  productId,
  variant = "default",
  size = "default",
  className,
}: AddToCartButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const handelAdd = async () => {
    try {
      await addToCart(productId);

      setSuccess(true);
      toast.success("Item added to cart successfully");
      setTimeout(() => setSuccess(false), 2000);

      router.refresh(); //Update cart count
    } catch (error) {
      console.log("Error adding to cart", error);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handelAdd}
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Adding...
          </div>
        ) : success ? (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Added!
          </div>
        ) : (
          <>
            {size !== "icon" ? (
              "Add to Cart"
            ) : (
              <ShoppingCartIcon className="mr-2 h-4 w-4" />
            )}
            {size !== "icon" && <ShoppingCartIcon className="mr-2 h-4 w-4" />}
          </>
        )}
      </Button>
    </div>
  );
};

export default AddToCartButton;
