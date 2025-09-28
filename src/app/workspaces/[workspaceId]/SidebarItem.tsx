import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        active: "bg-accent text-accent-foreground hover:bg-accent/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const SidebarItem = ({
  label,
  icon: Icon,
  id,
  variant,
  className,
}: {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
  className?: string;
}) => {
  const wId = useWorkspaceId();
  return (
    <Button
      asChild
      size={"sm"}
      id={id}
      className={cn(sidebarItemVariants({ variant }), className)}
    >
      <Link href={`/workspaces/${wId}/channels/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
export default SidebarItem;
