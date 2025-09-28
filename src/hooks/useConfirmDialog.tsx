import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JSX, useState } from "react";

const useConfirmDialog = (
  title: string,
  message: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const onClose = () => {
    setPromise(null);
  };
  const onCancel = () => {
    if (promise) {
      promise.resolve(false);
      onClose();
    }
  };
  const onConfirm = () => {
    if (promise) {
      promise.resolve(true);
      onClose();
    }
  };

  const ConfirmDialog = () => (
    <Dialog open={!!promise}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"outline"} onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
};

export default useConfirmDialog;
