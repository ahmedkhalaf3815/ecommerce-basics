import React, { useEffect, useState, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Loader2, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { getCart, removeItem } from "./lip/actions/cart";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "./lip/actions/checkOut";

type CartWithItems = any;

function CartSheet({ initialCart }: { initialCart?: any }) {
  const [cart, setCart] = useState<CartWithItems | null>(initialCart || null);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialCart) {
      setCart(initialCart);
    }
  }, [initialCart]);

  const router = useRouter();
  const loadCart = async () => {
    setLoading(true);

    try {
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (total: number, item: any) =>
        total + Number(item.product.price) * item.quantity,
      0,
    );
  };

  const itemCount =
    cart?.items?.reduce((acc: number, item: any) => {
      return acc + item.quantity;
    }, 0) || 0;

  const handelRemoveItem = async (id: string) => {
    await removeItem(id);
    await loadCart();
  };

  const handleCheckout = async () => {
    if (!cart) return;
    startTransition(async () => {
      try {
        const result = await createCheckoutSession();
        if (result?.url) {
          router.push(result.url);
        }
      } catch (e) {
        console.error("Checkout failed", e);
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="relative" />}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs pointer-events-none">
            {itemCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent className="flex flex-col h-full w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            {itemCount === 0
              ? "Your cart is empty."
              : `You have ${itemCount} items in your cart.`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-emerald-600" />
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center h-full text-muted-foreground space-y-4 justify-center py-4">
              <ShoppingCart className="h-12 w-12 opacity-20" />
              <p>Start adding items to your cart.</p>
            </div>
          ) : (
            <div className="space-y-4 px-4">
              {cart.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded bg-secondary">
                    <Image
                      fill
                      src={item.product.image}
                      alt={item.product.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm line-clamp-1">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x ${Number(item.product.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </div>
                  <Button
                    onClick={() => handelRemoveItem(item.id)}
                    className="ml-auto"
                    variant="ghost"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="border-t pt-6 space-y-4">
            <Separator />
            <div className="flex items-center justify-between text-base font-medium">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Checkout
            </Button>
          </div>
        )}

        {cart && cart.items.length > 0 && (
          <SheetFooter className="border-t pt-6 sm:justify-center">
            <div className="w-full space-y-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg"
                onClick={handleCheckout}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin" /> : "Checkout"}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;
