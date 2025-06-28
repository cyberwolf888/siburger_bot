import { Context } from "telegraf";

export function orderCommand(ctx: Context) {
  ctx.reply(
    "📋 To place an order, please contact us:\n\n" +
      "📞 Phone: +1 (555) 123-4567\n" +
      "🌐 Website: www.siburger.com\n" +
      "📍 Address: 123 Burger Street, Food City\n\n" +
      "Or reply with your order and we'll get back to you!"
  );
}
