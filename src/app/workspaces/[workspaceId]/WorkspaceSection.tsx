import Hint from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

type WorkspaceSectionProps = {
  label: string;
  hint?: string;
  onNew?: () => void;
  children: React.ReactNode;
};

const WorkspaceSection = ({
  label,
  hint = "",
  onNew,
  children,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);
  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center px-1 group">
        <Button
          onClick={toggle}
          variant={"transparent"}
          className="p-0.5 text-sm text-foreground shrink-0 size-6"
        >
          <FaCaretDown
            className={cn("size-4 transition-transform", { "-rotate-90": !on })}
          />
        </Button>
        <Button
          variant={"transparent"}
          size={"sm"}
          className="group px-1.5 text-sm h-[28px] text-foreground justify-start overflow-hidden"
        >
          <span className="truncate">{label}</span>
        </Button>
        {onNew ? (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              variant={"transparent"}
              size={"iconSm"}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-foreground size-6 shrink-0"
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        ) : null}
      </div>
      {on ? children : null}
    </div>
  );
};

export default WorkspaceSection;
