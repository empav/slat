import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground hover:bg-accent/80 hover:text-accent-foreground",
        active: "bg-accent text-accent-foreground hover:bg-accent/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const UserItem = ({
  label = "Member",
  image,
  id,
  variant,
  className,
}: {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
  className?: string;
}) => {
  const wId = useWorkspaceId();
  return (
    <Button
      variant={"transparent"}
      size={"sm"}
      id={id}
      asChild
      className={cn(userItemVariants({ variant }), className)}
    >
      <Link href={`/workspaces/${wId}/members/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage src={image} alt={label} className="rounded-md" />
          <AvatarFallback className="rounded-md bg-sky-600 text-white text-xs">
            {label?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
export default UserItem;
