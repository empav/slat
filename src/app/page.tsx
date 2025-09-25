"use client";

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import UserButton from "@/features/components/user-button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import useGetWorkspaces from "@/features/workspaces/api/useGetWorkspaces";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaces();
  const [isOpen, setIsOpen] = useCreateWorkspaceModal();

  const workspaceId = useMemo(() => {
    return data?.[0]?._id;
  }, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspaces/${workspaceId}`);
    } else if (!isOpen) {
      setIsOpen(true);
    }
  }, [isLoading, workspaceId, isOpen, setIsOpen, router]);

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
