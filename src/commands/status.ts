import { Context } from "telegraf";

export function statusCommand(ctx: Context) {
  ctx.reply("🔍 To check your order status, please provide your order number.");
}
