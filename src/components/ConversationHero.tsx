import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ConversationHero = ({
  name = "Member",
  image,
}: {
  name?: string;
  image?: string;
}) => {
  return (
    <div className="mt-[50px] mx-5">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-14 mr-2">
          <AvatarImage src={image} alt={name} className="rounded-md" />
          <AvatarFallback className="rounded-md bg-sky-600 text-white text-xs">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold">{name}</p>
      </div>
      <p className="font-normal text-slate-800 mb-4">
        This conversation is just between you and <strong>{name}</strong>
      </p>
    </div>
  );
};
export default ConversationHero;
