import dynamic from "next/dynamic";
import Quill from "quill/core/quill";
import { useRef } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

type ChatInputProps = {
  placeholder: string;
};

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  return (
    <div className="px-5 w-full">
      <Editor
        variant="create"
        placeholder={placeholder}
        innerRef={editorRef}
        onSubmit={() => {}}
        disabled={false}
      />
    </div>
  );
};
export default ChatInput;
