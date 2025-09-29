import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useRemoveChannel from "@/features/channels/api/useRemoveChannel";
import useUpdateChannel from "@/features/channels/api/useUpdateChannel";
import useCurrentMember from "@/features/members/api/useCurrentMember";
import useChannelId from "@/hooks/useChannelId";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

const Header = ({ title }: { title: string }) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const [ConfirmDialog, confirm] = useConfirmDialog(
    "Are you sure?",
    "This action cannot be undone."
  );

  const [value, setValue] = useState(title);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { mutate: updateChannel, isPending: isUpdatePending } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovePending } =
    useRemoveChannel();

  const onEditOpen = (value: boolean) => {
    if (currentMember?.role !== "admin") return;
    setValue(title);
    setIsEditOpen(value);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Channel updated");
          setIsEditOpen(false);
        },
        onError: () => {
          toast.error("failed to update channel");
        },
      }
    );
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel removed");
          router.push(`/workspaces/${workspaceId}`);
        },
        onError: () => {
          toast.error("failed to remove channel");
        },
      }
    );
  };

  return (
    <div className="bg-background flex items-center px-4 border-b overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size={"sm"}
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="ml-2 size-2.5" />
          </Button>
        </DialogTrigger>
        <span className="text-xs text-muted-foreground">
          Description of the channel goes here
        </span>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-background">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={isEditOpen} onOpenChange={onEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-background rounded-lg border cursor-pointer hover:bg-background/50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel Name</p>
                    {currentMember?.role === "admin" ? (
                      <p className="text-sm text-foreground hover:underline font-semibold">
                        Edit
                      </p>
                    ) : null}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename Channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <Input
                    value={value}
                    onChange={onChange}
                    disabled={isUpdatePending}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Channel Name"
                  />
                  <div className="flex justify-end gap-x-2">
                    <Button
                      variant={"outline"}
                      disabled={isUpdatePending}
                      type="button"
                      onClick={() => setIsEditOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button disabled={isUpdatePending} type="submit">
                      Save
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            {currentMember?.role === "admin" ? (
              <button
                disabled={isRemovePending}
                type="button"
                aria-label="Delete Channel"
                onClick={onDelete}
                className="flex items-center gap-x-2 px-5 py-4 bg-background rounded-lg border text-red-600 hover:bg-red-600/20 cursor-pointer"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete Channel</p>
              </button>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Header;
