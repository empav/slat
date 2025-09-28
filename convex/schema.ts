import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("byUserId", ["userId"])
    .index("byWorkspaceId", ["workspaceId"])
    .index("byUserIdAndWorkspaceId", ["userId", "workspaceId"]),

  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
  }).index("byWorkspaceId", ["workspaceId"]),
});

export default schema;
