"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import KittDen from "@/public/logo.png";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const navItems = [
  { id: 1, Label: "Library", href: "/" },
  { id: 2, Label: "Add New", href: "/books/new" },
  { id: 3, Label: "Pricing", href: "/subscriptions" },
];



const Navbar = () => {
  const path = usePathname();

  const {user } = useUser()

  return (
    <header className="w-full fixed bg-(--bg-primary) z-50 overflow-hidden ">
      <div className="wrapper py-4 navbar-height flex justify-between items-center">
        <Link href="/" className="flex gap-0.5 items-center">
          <Image alt="kittden logo" src={KittDen} width={150} height={26}  />
        </Link>
        <nav className="w-fit flex items-center gap-7.5">
          {navItems.map((item) => {
            const isActive =
              path == item.href ||
              (item.href != "/" && path.startsWith(item.href));
            return (
              <Link
                className={cn(
                  "nav-link-base",
                  isActive ? "nav-link-active" : "text-black hover:opacity-70",
                )}
                key={item.id}
                href={item.href}
              >
                {item.Label}
              </Link>
            );
          })}
          <div className="flex gap-7.5 items-center">
            <SignedOut>
              <SignInButton  mode="modal"/>
            </SignedOut>
            <SignedIn>
              <div className="nav-user-link">
                <UserButton />
                {
                  user?.firstName && (
                    <Link href={'/subscriptions'} className="nav-user-name">{user.firstName}</Link>
                  )
                }
              </div>
            </SignedIn>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
