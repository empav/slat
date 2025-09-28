import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import useCurrentMember from "@/features/members/api/useCurrentMember";
import useGetWorkspace from "@/features/workspaces/api/useGetWorkspace";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import WorkspaceHeader from "./WorkspaceHeader";
import SidebarItem from "./SidebarItem";
import useGetChannels from "@/features/channels/api/useGetChannels";
import WorkspaceSection from "./WorkspaceSection";
import useGetMembers from "@/features/members/api/useGetMembers";
import UserItem from "./UserItem";
import { useCreateChannelModal } from "@/features/channels/store/useCreateChannelModal";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const [, setIsCreateChannelModalOpen] = useCreateChannelModal();
  const { data: member, isLoading: isLoadingMember } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: isLoadingChannels } =
    useGetChannels(workspaceId);

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  if (
    isLoadingMember ||
    isLoadingWorkspace ||
    isLoadingChannels ||
    isLoadingMembers
  ) {
    return (
      <div className="flex flex-col bg-background h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col bg-background h-full items-center justify-center">
        <AlertTriangle />
        <p className="text-foreground text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={
          member.role === "admin"
            ? () => setIsCreateChannelModalOpen(true)
            : undefined
        }
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            label={item.name}
            icon={HashIcon}
            id={item._id}
            className="ml-4"
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label="Members" hint="Invite Members" onNew={() => {}}>
        {members?.map((item) => (
          <UserItem
            key={item._id}
            image={item.user.image}
            label={item.user.name}
            id={item._id}
            className="ml-3"
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
