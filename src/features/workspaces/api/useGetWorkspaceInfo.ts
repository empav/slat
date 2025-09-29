import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface Props {
  id: Id<"workspaces">;
}

const useGetWorkspaceInfo = ({ id }: Props) => {
  const data = useQuery(api.workspaces.getOneInfo, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useGetWorkspaceInfo;
