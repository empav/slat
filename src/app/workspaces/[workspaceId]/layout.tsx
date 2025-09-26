"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "./sidebar";
import Toolbar from "./toolbar";
import useCurrentUser from "@/features/auth/api/useCurrentUser";
import { Loader } from "lucide-react";
import WorkspaceSidebar from "./WorkspaceSidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: user } = useCurrentUser();

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-48px)] mt-0.5">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={`${user._id}-workspace-layout`}
        >
          <ResizablePanel defaultSize={40} minSize={15}>
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={40}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
