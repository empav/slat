import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import useGetMessage from "../api/useGetMessage";
import Message from "@/components/Message";
import useGetMessages, { GetMessagesReturnType } from "../api/useGetMessages";
import useCurrentMember from "@/features/members/api/useCurrentMember";
import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import useCreateMessage from "../api/useCreateMessage";
import useGenerateUploadUrl from "@/features/upload/api/useGenerateUploadUrl";
import useChannelId from "@/hooks/useChannelId";
import { toast } from "sonner";
import { differenceInMinutes, format } from "date-fns";
import { formatDateLabel, TIME_THRESHOLD } from "@/components/MessageList";

type Message = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

const Thread = ({
  messageId,
  onClose,
}: {
  messageId: Id<"messages">;
  onClose: () => void;
}) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { data: message, isLoading: isLoadingMessage } = useGetMessage({
    id: messageId,
  });
  const {
    results: messages,
    status,
    loadMore,
  } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [key, setKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const messagesByDate = messages.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof messages>
  );

  const onSubmit = async ({
    image,
    body,
  }: {
    image: File | null;
    body: string;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const createdMessage: Message = {
        body,
        workspaceId,
        parentMessageId: messageId,
        channelId,
        image: undefined,
      };

      if (image) {
        const uploadUrl = await generateUploadUrl({ throw: true });
        if (!uploadUrl) throw new Error("Failed to get upload URL");
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });
        if (!res.ok) throw new Error("Failed to upload image");
        const { storageId } = await res.json();
        createdMessage.image = storageId;
      }

      await createMessage(createdMessage, { throw: true });
      setKey((prev) => prev + 1);
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  const onInfiniteScroll = (el: HTMLDivElement | null) => {
    if (el) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && status === "CanLoadMore") {
            loadMore();
          }
        },
        { threshold: 1.0 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-[50px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      {isLoadingMessage || status === "LoadingFirstPage" ? (
        <div className="h-full flex items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : !message ? (
        <div className="h-full flex flex-col items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-muted-foreground">Message not found</p>
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
            {Object.entries(messagesByDate).map(([dateKey, messages]) => (
              <div key={dateKey} className="space-y-2">
                <div className="text-center my-2 relative">
                  <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                  <span className="relative inline-block bg-background text-xs px-4 py-1 rounded-full border border-gray-300 shadow-sm">
                    {formatDateLabel(dateKey)}
                  </span>
                </div>
                {messages.map((msg, idx) => (
                  <Message
                    key={msg._id}
                    message={msg}
                    isEditing={editingId === msg._id}
                    setEditingId={setEditingId}
                    isCompact={
                      messages[idx - 1] &&
                      messages[idx - 1].user._id &&
                      msg.user._id === messages[idx - 1].user._id &&
                      differenceInMinutes(
                        new Date(msg._creationTime),
                        new Date(messages[idx - 1]._creationTime)
                      ) < TIME_THRESHOLD
                    }
                    isAuthor={msg.memberId === currentMember?._id}
                    hideThreadButton
                  />
                ))}
              </div>
            ))}
            <div className="h-1" ref={onInfiniteScroll} />
            <Message
              message={message as GetMessagesReturnType[number]}
              hideThreadButton
              isAuthor={currentMember?._id === message.member._id}
              isEditing={editingId === message._id}
              setEditingId={setEditingId}
            />
          </div>
          <div className="px-4">
            <Editor
              key={key}
              onSubmit={onSubmit}
              disabled={isPending}
              innerRef={editorRef}
              placeholder="Reply..."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Thread;
