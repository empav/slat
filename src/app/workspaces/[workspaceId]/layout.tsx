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
import Profile from "@/features/members/components/Profile";
import { useUpdateLastSeen } from "@/features/members/api/useUpdateLastSeen";
import { useEffect, useState } from "react";
import useCurrentMember from "@/features/members/api/useCurrentMember";
import useWorkspaceId from "@/app/hooks/useWorkspaceId";

const POLLING_LAST_SEEN = 15000; // 15s

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: user } = useCurrentUser();
  const workspaceId = useWorkspaceId();
  const { data: member } = useCurrentMember({
    workspaceId,
  });
  const { mutate: updateLastSeen } = useUpdateLastSeen();
  const { parentMessageId, onClose, profileMemberId } = usePanel();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!member || !workspaceId) return;
    if (!mounted) {
      updateLastSeen({ memberId: member._id, workspaceId });
      setMounted(true);
    }
    const interval = setInterval(() => {
      updateLastSeen({ memberId: member._id, workspaceId });
    }, POLLING_LAST_SEEN);
    return () => clearInterval(interval);
  }, [updateLastSeen, member, workspaceId, mounted]);

  if (!user) {
    return <Loader />;
  }

  const showPanel = !!parentMessageId || !!profileMemberId;

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
          <ResizablePanel minSize={40} defaultSize={80}>
            {children}
          </ResizablePanel>
          {showPanel ? (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={30} maxSize={50}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<"members">}
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
