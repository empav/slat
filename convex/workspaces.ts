import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");
  return code;
};

export const removeOne = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("byUserIdAndWorkspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.id)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new ConvexError("Not authenticated");
    }

    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("byWorkspaceId", (q) => q.eq("workspaceId", args.id))
        .collect(),
    ]);

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const updateOne = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("byUserIdAndWorkspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.id)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new ConvexError("Not authenticated");
    }
    await ctx.db.patch(args.id, { name: args.name });

    return args.id;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const joinCode = generateCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });
    await ctx.db.insert("channels", {
      name: "General",
      workspaceId,
    });

    return workspaceId;
  },
});

export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();

    if (members.length === 0) {
      return [];
    }

    const workspaceIds = members.map((m) => m.workspaceId);

    const workspaces = [];
    for (const id of workspaceIds) {
      const workspace = await ctx.db.get(id);
      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

export const getOne = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("byUserIdAndWorkspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.id)
      )
      .first();

    if (!member) {
      return null;
    }

    return await ctx.db.get(args.id);
  },
});
