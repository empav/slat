import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import useGetWorkspace from "@/features/workspaces/api/useGetWorkspace";
import { InfoIcon, SearchIcon } from "lucide-react";

const Toolbar = () => {
  const wId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ id: wId });

  return (
    <nav className="flex items-center justify-between p-1.5 h-12 bg-sidebar border-b-2 border-sidebar-foreground/10">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-sidebar-foreground/25 hover:bg-sidebar-foreground-5 w-full justify-start h-7 px-2"
        >
          <SearchIcon className="size-4 text-sidebar-foreground mr-2" />
          <span className="text-sidebar-foreground text-xs">
            Search {isLoading ? "..." : data?.name}
          </span>
        </Button>
      </div>
      <div className="ml-auto flex-1 items-center flex justify-end gap-x-2">
        <ThemeSwitcher />
        <Button variant={"transparent"} size={"iconSm"}>
          <InfoIcon className="size-5 text-sidebar-foreground" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
