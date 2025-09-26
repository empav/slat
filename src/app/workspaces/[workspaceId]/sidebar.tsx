"use client";

import UserButton from "@/features/components/user-button";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import SidebarButton from "./SidebarButton";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-[70px] h-full bg-background flex flex-col gap-y-4 items-center pt-[10px] pb-4 border-r-2 border-foreground/10">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/workspaces/")}
      />
      <SidebarButton
        icon={MessagesSquare}
        label="DMs"
        isActive={pathname.includes("/messages/")}
      />
      <SidebarButton
        icon={Bell}
        label="Activities"
        isActive={pathname.includes("/activities/")}
      />
      <SidebarButton
        icon={MoreHorizontal}
        label="More"
        isActive={pathname.includes("/more/")}
      />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};

export default Sidebar;
