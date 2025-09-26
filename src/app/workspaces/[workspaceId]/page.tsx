"use client";

import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import useGetWorkspace from "@/features/workspaces/api/useGetWorkspace";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ id: workspaceId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Workspace not found</div>;
  }

  return <div>Test page {workspaceId}</div>;
};

export default WorkspaceIdPage;
