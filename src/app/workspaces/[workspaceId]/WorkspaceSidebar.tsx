import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import useCurrentMember from "@/features/members/api/useCurrentMember";
import useGetWorkspace from "@/features/workspaces/api/useGetWorkspace";
import { AlertTriangle, Loader } from "lucide-react";
import WorkspaceHeader from "./WorkspaceHeader";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: isLoadingMember } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
    id: workspaceId,
  });

  if (isLoadingMember || isLoadingWorkspace) {
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
    </div>
  );
};

export default WorkspaceSidebar;
