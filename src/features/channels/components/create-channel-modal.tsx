"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateChannelModal } from "../store/useCreateChannelModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useCreateChannel from "../api/useCreateChannel";
import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import { toast } from "sonner";

export const CreateChannelModal = () => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateChannel();
  const [isOpen, setIsOpen] = useCreateChannelModal();
  const [name, setName] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { name, workspaceId },
      {
        onSuccess: () => {
          onClose();
          toast.success("Channel created");
        },
      }
    );
  };

  const onClose = () => {
    setIsOpen(false);
    setName("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            placeholder="Channel name e.g. 'Random' or 'Frontend-team'"
            value={name}
            onChange={onChange}
            required
            autoFocus
            disabled={isPending}
            minLength={3}
            maxLength={80}
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
