import Quill, { Delta, Op, QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, SendIcon, Smile, XIcon } from "lucide-react";
import Hint from "./Hint";
import { cn } from "@/lib/utils";
import EmojiPopover from "./EmojiPopover";
import Image from "next/image";

type EditorValue = {
  image: File | null;
  body: string;
};

type EditorProps = {
  variant?: "create" | "update";
  onSubmit: (value: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: React.RefObject<Quill | null>;
};

const Editor = ({
  variant = "create",
  onSubmit,
  onCancel,
  placeholder = "Write a message...",
  defaultValue = [],
  disabled = false,
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const imageRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                submitRef.current({
                  image: addedImage,
                  body: JSON.stringify(body),
                });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection(true)?.index || 0, "\n");
              },
            },
          },
        },
      },
    };
    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();
    if (innerRef) {
      innerRef.current = quill;
    }
    quill.setContents(defaultValueRef.current);
    setText(quill.getText());
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((prev) => !prev);
    const toolbarElem = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElem) {
      toolbarElem.classList.toggle("hidden");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEmojiSelect = (emoji: any) => {
    if (!quillRef.current) return;

    quillRef.current.insertText(
      quillRef.current.getSelection()?.index || 0,
      emoji.native
    );
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        className="hidden"
        ref={imageRef}
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-background",
          disabled && "opacity-60 pointer-events-none"
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />
        {!!image ? (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageRef.current!.value = "";
                  }}
                  className="hidden group-hover/image:flex rounded-full bg-background/80 hover:bg-background absolute -top-2.5 -right-2.5 text-foreground size-6 z-[4] border-2 border-foreground items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded image"
                fill
                className="object-cover border rounded-xl overflow-hidden"
              />
            </div>
          </div>
        ) : null}
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
          >
            <Button
              disabled={disabled}
              variant="ghost"
              size="iconSm"
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect} hint="Emoji">
            <Button disabled={false} variant="ghost" size="iconSm">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === "create" ? (
            <Hint label="Image">
              <Button
                disabled={disabled}
                variant="ghost"
                size="iconSm"
                onClick={() => imageRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          ) : null}
          {variant === "update" ? (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant={"outline"}
                size={"sm"}
                disabled={disabled}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onSubmit({
                    image,
                    body: JSON.stringify(quillRef.current?.getContents()),
                  });
                }}
                size={"sm"}
                disabled={disabled || isEmpty}
                className="bg-foreground text-background hover:bg-foreground/80"
              >
                Save
              </Button>
            </div>
          ) : null}
          {variant === "create" ? (
            <Hint label="Send message">
              <Button
                disabled={disabled || isEmpty}
                className="ml-auto bg-foreground text-background hover:bg-foreground/80"
                size={"sm"}
                onClick={() => {
                  onSubmit({
                    image,
                    body: JSON.stringify(quillRef.current?.getContents()),
                  });
                }}
              >
                <SendIcon className="size-4" />
              </Button>
            </Hint>
          ) : null}
        </div>
      </div>
      {variant === "create" ? (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition-opacity",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + return</strong> to add a new line
          </p>
        </div>
      ) : null}
    </div>
  );
};
export default Editor;
