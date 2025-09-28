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
import useRemoveWorkspace from "@/features/workspaces/api/useRemoveWorkspace";
import useUpdateWorkspace from "@/features/workspaces/api/useUpdateWorkspace";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const PreferencesModal = ({
  isOpen,
  setOpen,
  initialValue,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirmDialog(
    "Are you sure?",
    "This action cannot be undone."
  );
  const [value, setValue] = useState(initialValue);

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Workspace updated");
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success("Workspace deleted");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to delete workspace");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-background overflow-hidden">
          <DialogHeader className="p-4 border-b bg-background">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <div className="px-4 py-4 bg-background rounded-lg border cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace Name</p>
                    <p className="text-sm text-muted-foreground hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <Input
                    disabled={isUpdatingWorkspace}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace Name e.g. My Workspace"
                  />
                  <div className="flex items-center justify-end gap-x-2">
                    <Button
                      type="button"
                      variant={"outline"}
                      disabled={isUpdatingWorkspace}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdatingWorkspace}>
                      Save
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isRemovingWorkspace}
              onClick={onDelete}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete Workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreferencesModal;
