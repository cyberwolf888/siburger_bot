import "dotenv/config";
import { Telegraf, Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { startCommand } from "./commands/start";
import { helpCommand } from "./commands/help";
import { menuCommand } from "./commands/menu";
import { orderCommand } from "./commands/order";
import { statusCommand } from "./commands/status";

// Create bot instance
const bot = new Telegraf(process.env.BOT_TOKEN || "");

// Middleware to log all updates
bot.use((ctx: Context<Update>, next) => {
  console.log(`Received update:`, ctx.update);
  return next();
});

// Start command
bot.start(startCommand);

// Help command
bot.help(helpCommand);

// Menu command
bot.command("menu", menuCommand);

// Order command
bot.command("order", orderCommand);

// Status command
bot.command("status", statusCommand);

// Handle text messages
bot.on("text", (ctx) => {
  const message = ctx.message.text.toLowerCase();

  if (message.includes("burger") || message.includes("food")) {
    ctx.reply("🍔 Hungry? Check out our /menu or place an /order!");
  } else if (message.includes("order")) {
    ctx.reply(
      "📋 Use /order to place an order or /status to check your order status."
    );
  } else {
    ctx.reply("👋 Hello! Type /help to see what I can do for you.");
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error("Bot error:", err);
  ctx.reply("❌ Sorry, something went wrong. Please try again.");
});

// Graceful shutdown
process.once("SIGINT", () => {
  console.log("Received SIGINT. Graceful shutdown...");
  bot.stop("SIGINT");
  process.exit(0);
});

process.once("SIGTERM", () => {
  console.log("Received SIGTERM. Graceful shutdown...");
  bot.stop("SIGTERM");
  process.exit(0);
});

// Start the bot
if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN environment variable is required");
  process.exit(1);
}

bot
  .launch()
  .then(() => {
    console.log("🤖 SiBurger Bot is running!");
  })
  .catch((error) => {
    console.error("❌ Failed to start bot:", error);
    process.exit(1);
  });
