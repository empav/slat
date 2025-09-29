"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

type Props = {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
};

const SidebarButton = ({ icon: Icon, label, isActive }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
      <Button
        variant={"transparent"}
        className={cn("size-9 p-2", isActive && "bg-sidebar-foreground/10")}
      >
        <Icon className="size-6 text-sidebar-foreground p-0.5 group-hover:scale-115 transition-all" />
      </Button>
      <span className="text-[11px] text-sidebar-foreground">{label}</span>
    </div>
  );
};

export default SidebarButton;
