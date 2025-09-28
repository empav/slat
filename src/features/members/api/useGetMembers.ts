import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const useGetMembers = ({ workspaceId }: { workspaceId: Id<"workspaces"> }) => {
  const data = useQuery(api.members.getMany, {
    workspaceId,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useGetMembers;
