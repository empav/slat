import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useNewJoinCode from "@/features/workspaces/api/useNewJoinCode";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

const InviteModal = ({
  isOpen,
  setOpen,
  name,
  joinCode,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}) => {
  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirmDialog(
    "Are you sure?",
    " This will generate a new join code and invalidate the previous one."
  );

  const { mutate, isPending } = useNewJoinCode();

  const onCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      // Optionally, you can add some feedback to the user here
      toast.success("Invite link copied to clipboard!");
    });
  };

  const onRegenerate = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Join code regenerated!");
        },
        onError: () => {
          toast.error("Failed to regenerate join code. Please try again.");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite People to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite new members to your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold uppercase">{joinCode}</p>
            <Button variant={"ghost"} size={"sm"} onClick={onCopy}>
              Copy Link
              <CopyIcon className="size-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={onRegenerate}
              disabled={isPending}
            >
              Regenerate Code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
