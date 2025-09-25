"use client";

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import UserButton from "@/features/components/user-button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <nav className="w-full h-18 flex items-center justify-between px-10 py-2 shadow-md">
      <Link href={"/"}>
        <Image src={"/next.svg"} alt="Logo" width={40} height={40} />
      </Link>
      <div className="flex items-center gap-x-8">
        <ThemeSwitcher />
        <UserButton />
      </div>
    </nav>
  );
}
