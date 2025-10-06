import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const INTERVAL_LAST_SEEN = 30000;

export const isOnline = (lastSeen: number | undefined) => {
  return lastSeen ? lastSeen > Date.now() - INTERVAL_LAST_SEEN : false;
};

const populateUsers = async (ctx: QueryCtx, id: Id<"users">) => {
  return ctx.db.get(id);
};

export const getOne = query({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const member = await ctx.db.get(args.memberId);
    if (!member) {
      return null;
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("byUserIdAndWorkspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", member.workspaceId)
      )
      .unique();

    if (!currentMember) {
      return null;
    }

    const user = await populateUsers(ctx, member.userId);
    if (!user) {
      return null;
    }

    return {
      ...member,
      isOnline: isOnline(member.lastSeen),
      user,
    };
  },
});

export const current = query({
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
      return null;
    }

    return { ...member, isOnline: isOnline(member.lastSeen) };
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

    const data = await ctx.db
      .query("members")
      .withIndex("byWorkspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const members = [];
    for (const m of data) {
      const user = await populateUsers(ctx, m.userId);
      if (user) {
        members.push({
          ...m,
          isOnline: isOnline(m.lastSeen),
          user,
        });
      }
    }

    return members;
  },
});

export const updateLastSeen = mutation({
  args: {
    memberId: v.id("members"),
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
      .unique();
    if (!member) {
      throw new ConvexError("Not authenticated");
    }

    if (member._id !== args.memberId) {
      throw new ConvexError("Not authenticated");
    }

    await ctx.db.patch(args.memberId, {
      lastSeen: Date.now(),
    });
    return args.memberId;
  },
});
