import { internalMutation } from "./_generated/server";
import { isOnline } from "./members";
import { Id } from "./_generated/dataModel";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

export const resend: Resend = new Resend(components.resend, {
  testMode: true,
});

export const sendEmail = internalMutation({
  args: {},
  handler: async (ctx) => {
    const pending = await ctx.db
      .query("notifications")
      .filter((r) => r.and(r.eq(r.field("sent"), false)))
      .collect();

    if (!pending) return;

    const grouped = pending.reduce<Record<Id<"members">, typeof pending>>(
      (acc, notif) => {
        acc[notif.memberId] = acc[notif.memberId] || [];
        acc[notif.memberId].push(notif);
        return acc;
      },
      {}
    );

    for (const [memberId, notifications] of Object.entries(grouped)) {
      const member = await ctx.db.get(memberId as Id<"members">);
      if (!member || isOnline(member.lastSeen)) continue;

      const user = await ctx.db.get(member.userId);
      if (!user) {
        return;
      }

      await resend.sendEmail(ctx, {
        from: "Emanuele Pavan <delivered@resend.dev>",
        to: "delivered@resend.dev",
        subject: `[SLAT]: You have ${notifications.length} unread messages`,
        text: "This is a test email",
      });
    }

    for (const p of pending) {
      await ctx.db.patch(p._id, { sent: true });
    }
  },
});
