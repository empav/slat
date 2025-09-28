import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMany = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("byUserIdAndWorkspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!member) {
      return [];
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("byWorkspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    return channels;
  },
});
