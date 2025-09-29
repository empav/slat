import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getOne = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }
    const channel = await ctx.db.get(args.channelId);

    if (!channel) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("byUserIdAndWorkspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", channel.workspaceId)
      )
      .unique();

    if (!member) {
      return null;
    }

    return channel;
  },
});

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

export const updateOne = mutation({
  args: {
    id: v.id("channels"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const channel = await ctx.db.get(args.id);
    if (!channel) {
      throw new ConvexError("Channel not found");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("byUserIdAndWorkspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", channel.workspaceId)
      )
      .first();

    if (!member || member.role !== "admin") {
      throw new ConvexError("Not authenticated");
    }

    await ctx.db.patch(args.id, { name: args.name });

    return args.id;
  },
});

export const removeOne = mutation({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const channel = await ctx.db.get(args.id);
    if (!channel) {
      throw new ConvexError("Channel not found");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("byUserIdAndWorkspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", channel.workspaceId)
      )
      .first();

    if (!member || member.role !== "admin") {
      throw new ConvexError("Not authenticated");
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
