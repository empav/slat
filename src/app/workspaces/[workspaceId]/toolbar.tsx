import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import useGetWorkspace from "@/features/workspaces/api/useGetWorkspace";
import { InfoIcon, SearchIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useState } from "react";
import useGetChannels from "@/features/channels/api/useGetChannels";
import useGetMembers from "@/features/members/api/useGetMembers";
import { useRouter } from "next/navigation";

const Toolbar = () => {
  const router = useRouter();
  const wId = useWorkspaceId();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetWorkspace({ id: wId });
  const { data: channels } = useGetChannels({ workspaceId: wId });
  const { data: members } = useGetMembers({ workspaceId: wId });

  const onSelectChannel = (id: string) => {
    setOpen(false);
    router.push(`/workspaces/${wId}/channels/${id}`);
  };

  const onSelectMember = (id: string) => {
    setOpen(false);
    router.push(`/workspaces/${wId}/members/${id}`);
  };

  return (
    <nav className="flex items-center justify-between p-1.5 h-12 bg-sidebar border-b-2 border-sidebar-foreground/10">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-sidebar-foreground/25 hover:bg-sidebar-foreground-5 w-full justify-start h-7 px-2"
          onClick={() => setOpen(true)}
        >
          <SearchIcon className="size-4 text-sidebar-foreground mr-2" />
          <span className="text-sidebar-foreground text-xs">
            Search {isLoading ? "..." : data?.name}
          </span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onSelectChannel(channel._id)}
                >
                  # {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => onSelectMember(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
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
