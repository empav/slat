import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import Hint from "@/components/Hint";

const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}) => {
  return (
    <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"sm"}
            variant="transparent"
            className="font-semibold text-lg w-auto p-1-5 overflow-hidden"
          >
            <span className="text-foreground truncate">{workspace.name}</span>
            <ChevronDown className="size-4 ml-1 shrink-0 text-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom" className="w-64">
          <DropdownMenuItem className="cursor-pointer capitalize">
            <div className="size-9 relative overflow-hidden bg-background text-foreground font-semibold text-xl rounded-md flex items-center justify-center mr-2">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col items-start">
              <p className="font-bold">{workspace.name}</p>
              <p className="text-xs text-muted-foreground">Active Workspace</p>
            </div>
          </DropdownMenuItem>
          {isAdmin ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer py-2">
                Invite people to {workspace.name}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2">
                Preferences
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-0.5">
        <Hint label="Filter chats" side="bottom" align="end">
          <Button size={"iconSm"} variant={"transparent"}>
            <ListFilter className="size-4 text-foreground" />
          </Button>
        </Hint>
        <Hint label="New Message" side="bottom" align="end">
          <Button size={"iconSm"} variant={"transparent"}>
            <SquarePen className="size-4 text-foreground" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

export default WorkspaceHeader;
