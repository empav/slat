import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import useGetWorkspace from "@/features/workspaces/api/useGetWorkspace";
import { InfoIcon, SearchIcon } from "lucide-react";

const Toolbar = () => {
  const wId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ id: wId });

  return (
    <nav className="flex items-center justify-between p-1.5 h-10 bg-foreground">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
        >
          <SearchIcon className="size-4 text-white mr-2" />
          <span className="text-white text-xs">
            Search {isLoading ? "..." : data?.name}
          </span>
        </Button>
      </div>
      <div className="ml-auto flex-1 items-center flex justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <InfoIcon className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
