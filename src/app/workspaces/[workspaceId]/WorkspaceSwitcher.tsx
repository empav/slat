"use client";

import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetWorkspace from "@/features/workspaces/api/useGetWorkspace";
import useGetWorkspaces from "@/features/workspaces/api/useGetWorkspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [, setIsOpen] = useCreateWorkspaceModal();

  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const { data: workspaces, isLoading: isWorkspacesLoading } =
    useGetWorkspaces();

  const filteredWorkspaces = isWorkspacesLoading
    ? []
    : workspaces!.filter((ws) => ws._id !== workspaceId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 overflow-hidden bg-sidebar-foreground/5 hover:bg-sidebar-foreground/5 text-sidebar-foreground font-semibold text-xl">
          {isWorkspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          className="cursor-pointer flex-col justify-start items-start capitalize"
          onClick={() => router.push(`/workspaces/${workspaceId}`)}
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces.map((ws) => (
          <DropdownMenuItem
            key={ws._id}
            className="cursor-pointer capitalize overflow-hidden"
            onClick={() => router.push(`/workspaces/${ws._id}`)}
          >
            <Button className="size-9 overflow-hidden bg-sidebar hover:bg-sidebar-foreground/80 text-sidebar-foreground font-semibold text-xl">
              {ws.name.charAt(0).toUpperCase()}
            </Button>
            <p className="truncate">{ws.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={() => setIsOpen(true)}>
          <div className="size-9 relative overflow-hidden bg-sidebar text-sidebar-foreground font-semibold text-lg rounded-md flex items-center justify-center mr-3">
            <Plus className="text-sidebar-foreground" />
          </div>
          Create a new Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceSwitcher;
