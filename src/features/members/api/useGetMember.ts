import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const useGetMember = ({ memberId }: { memberId: Id<"members"> }) => {
  const data = useQuery(api.members.getOne, {
    memberId,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useGetMember;
