import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import useGetWorkspace from "@/features/workspaces/api/useGetWorkspace";
import { InfoIcon, SearchIcon } from "lucide-react";

const Toolbar = () => {
  const wId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ id: wId });

  return (
    <nav className="flex items-center justify-between p-1.5 h-12 bg-background border-b-2 border-foreground/10">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-foreground/5 hover:bg-foreground-5 w-full justify-start h-7 px-2"
        >
          <SearchIcon className="size-4 text-foreground mr-2" />
          <span className="text-foreground text-xs">
            Search {isLoading ? "..." : data?.name}
          </span>
        </Button>
      </div>
      <div className="ml-auto flex-1 items-center flex justify-end gap-x-2">
        <ThemeSwitcher />
        <Button variant={"transparent"} size={"iconSm"}>
          <InfoIcon className="size-5 text-foreground" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
