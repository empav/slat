import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import useCreateMessage from "@/features/messages/api/useCreateMessage";
import useChannelId from "@/hooks/useChannelId";
import dynamic from "next/dynamic";
import Quill from "quill/core/quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

type ChatInputProps = {
  placeholder: string;
};

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [key, setKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { mutate: createMessage } = useCreateMessage();

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
      await createMessage(
        {
          body,
          workspaceId,
          channelId,
        },
        { throw: true }
      );
      setKey((prev) => prev + 1);
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsPending(false);
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
