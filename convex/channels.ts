import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
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

export const createOne = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("byUserIdAndWorkspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .first();

    if (!member || member.role !== "admin") {
      throw new ConvexError("Not authenticated");
    }

    const name = args.name.replace(/\s+/g, "-").toLowerCase();

    const channelId = await ctx.db.insert("channels", {
      name,
      workspaceId: args.workspaceId,
    });
    return channelId;
  },
});
