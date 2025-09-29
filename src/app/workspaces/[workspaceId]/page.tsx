"use client";

import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import useGetChannels from "@/features/channels/api/useGetChannels";
import { useCreateChannelModal } from "@/features/channels/store/useCreateChannelModal";
import useCurrentMember from "@/features/members/api/useCurrentMember";
import useGetWorkspace from "@/features/workspaces/api/useGetWorkspace";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkspaceIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: isLoadingMember } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: isChannelsLoading } = useGetChannels({
    workspaceId,
  });

  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  const channelId = useMemo(() => {
    if (channels && channels.length > 0) {
      return channels[0]._id;
    }
    return null;
  }, [channels]);

  useEffect(() => {
    if (
      isWorkspaceLoading ||
      isChannelsLoading ||
      !workspace ||
      !isLoadingMember ||
      !member
    )
      return;
    if (channelId) {
      router.replace(`/workspaces/${workspaceId}/channels/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    isWorkspaceLoading,
    workspace,
    isChannelsLoading,
    channels,
    router,
    workspaceId,
    channelId,
    open,
    setOpen,
    isLoadingMember,
    member,
    isAdmin,
  ]);

  if (isWorkspaceLoading || isChannelsLoading || isLoadingMember) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">No channel found</p>
    </div>
  );
};

export default WorkspaceIdPage;
