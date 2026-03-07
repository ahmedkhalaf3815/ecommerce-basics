"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Diamond } from "lucide-react";
import CartSheet from "./CartSheet";
import { CartWithItems } from "./lip/actions/cart";

const Navebar = ({ cart }: { cart?: CartWithItems | null }) => {
  const { user, isLoaded } = useUser();
  return (
    <div className="border-b bg-white sticky top-0 z-50 p-2">
      <div className="container mx-auto h-25 flex items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold text-emerald-700 flex items-center gap-2"
        >
          <Image width={120} height={120} src="/logo.png" alt="logo" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-emerald-600 transition-colos">
            Home
          </Link>
          <Link
            href="/planner"
            className="hover:text-emerald-600 transition-colos"
          >
            Ai Planner
          </Link>
          <Link
            href="/products"
            className="hover:text-emerald-600 transition-colos"
          >
            Shop
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isLoaded && user ? (
            <>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Orders"
                    labelIcon={<Diamond className="w-4 h-4" />}
                    href="/orders"
                  />
                </UserButton.MenuItems>
              </UserButton>
              <CartSheet initialCart={cart} />
            </>
          ) : (
            isLoaded && (
              <>
                <SignInButton mode="modal">
                  <Button>Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Navebar;
