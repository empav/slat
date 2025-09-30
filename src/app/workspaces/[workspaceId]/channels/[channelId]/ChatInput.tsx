import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import useCreateMessage from "@/features/messages/api/useCreateMessage";
import useGenerateUploadUrl from "@/features/upload/api/useGenerateUploadUrl";
import useChannelId from "@/hooks/useChannelId";
import dynamic from "next/dynamic";
import Quill from "quill/core/quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

type ChatInputProps = {
  placeholder: string;
};

type Message = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [key, setKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const onSubmit = async ({
    image,
    body,
  }: {
    image: File | null;
    body: string;
  }) => {
    console.log({ image, body });

    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const createdMessage: Message = {
        body,
        workspaceId,
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

  return (
    <div className="px-5 w-full">
      <Editor
        key={key}
        variant="create"
        placeholder={placeholder}
        innerRef={editorRef}
        onSubmit={onSubmit}
        disabled={isPending}
      />
    </div>
  );
};
export default ChatInput;
