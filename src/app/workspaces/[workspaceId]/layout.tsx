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
import usePanel from "@/hooks/usePanel";
import { Id } from "../../../../convex/_generated/dataModel";
import Thread from "@/features/messages/components/Thread";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: user } = useCurrentUser();
  const { parentMessageId, onClose } = usePanel();

  if (!user) {
    return <Loader />;
  }

  const showPanel = !!parentMessageId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-48px)]">
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
          {showPanel ? (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={30} maxSize={50}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          ) : null}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
