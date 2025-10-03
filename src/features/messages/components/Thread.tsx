import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import useGetMessage from "../api/useGetMessage";
import Message from "@/components/Message";
import { GetMessagesReturnType } from "../api/useGetMessages";
import useCurrentMember from "@/features/members/api/useCurrentMember";
import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import { useState } from "react";

const Thread = ({
  messageId,
  onClose,
}: {
  messageId: Id<"messages">;
  onClose: () => void;
}) => {
  const workspaceId = useWorkspaceId();
  const { data: message, isLoading: isLoadingMessage } = useGetMessage({
    id: messageId,
  });
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  return (
    <div className="h-full flex flex-col">
      <div className="h-[50px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      {isLoadingMessage ? (
        <div className="h-full flex items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : !message ? (
        <div className="h-full flex flex-col items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-muted-foreground">Message not found</p>
        </div>
      ) : (
        <Message
          message={message as GetMessagesReturnType[number]}
          hideThreadButton
          isAuthor={currentMember?._id === message.member._id}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      )}
    </div>
  );
};

export default Thread;
