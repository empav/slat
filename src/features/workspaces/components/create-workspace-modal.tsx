"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/useCreateWorkspaceModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCreateWorkspace from "../api/useCreateWorkspace";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const CreateWorkspaceModal = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateWorkspace();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        name,
      },
      {
        onSuccess: (workspaceId) => {
          setIsOpen(false);
          router.push(`/workspaces/${workspaceId}`);
          toast.success("Workspace created");
        },
      }
    );
  };

  const onClose = () => {
    setIsOpen(false);
    setName("");
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            placeholder="Workspace name e.g. 'Work' or 'Personal' or 'Home'"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            disabled={isPending}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
