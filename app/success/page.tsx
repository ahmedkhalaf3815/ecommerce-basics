import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ClearCartEffect } from "./ClearCartEffect";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SuccessPage(props: Props) {
  const searchParams = await props.searchParams;
  const sessionId = searchParams?.session_id as string | undefined;

  return (
    <>
      {sessionId && <ClearCartEffect sessionId={sessionId} />}

      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl text-center border border-gray-100 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-32 bg-emerald-50 -z-10 rounded-t-3xl border-b border-emerald-100/50"></div>

          <div className="flex justify-center -mt-4 relative z-10">
            <div className="rounded-full bg-emerald-100 p-4 shadow-sm ring-8 ring-white">
              <CheckCircle2 className="h-16 w-16 text-emerald-600" />
            </div>
          </div>

          <div className="pt-2">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Payment Successful!
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Thank you for your purchase. Your order has been confirmed and our
              team is getting your items ready for shipment.
            </p>
          </div>

          <div className="mt-10 flex flex-col space-y-4">
            <Button
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-shadow"
            >
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 font-semibold"
              >
                <ShoppingBag className="h-5 w-5" />
                Continue Shopping
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Link
                href="/"
                className="flex items-center justify-center gap-2 font-medium"
              >
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
