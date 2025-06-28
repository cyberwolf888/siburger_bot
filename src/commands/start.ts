import { Context } from "telegraf";

export function startCommand(ctx: Context) {
  ctx.reply("🍔 Welcome to SiBurger Bot! How can I help you today?");
}
