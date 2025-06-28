import { Context } from "telegraf";

export function helpCommand(ctx: Context) {
  ctx.reply(
    "🍔 SiBurger Bot Commands:\n\n" +
      "/start - Start the bot\n" +
      "/help - Show this help message\n" +
      "/menu - View our burger menu\n" +
      "/order - Place an order\n" +
      "/status - Check order status"
  );
}
