import "dotenv/config";
import { Telegraf, Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { startCommand } from "./commands/start";
import { helpCommand } from "./commands/help";
import { menuCommand } from "./commands/menu";
import { orderCommand, processOrderText } from "./commands/order";
import {
  statusCommand,
  checkOrderStatus,
  getUserOrders,
} from "./commands/status";
import { validateFirebaseConfig } from "./utilities/firebase";
import { UsersService } from "./utilities/database";

// Create bot instance
const bot = new Telegraf(process.env.BOT_TOKEN || "");

// Middleware to log all updates and track users
bot.use(async (ctx: Context<Update>, next) => {
  console.log(`Received update:`, ctx.update);

  // Track user activity in Firebase if user info is available
  if (ctx.from) {
    try {
      await UsersService.createOrUpdateUser({
        id: ctx.from.id,
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
      });
    } catch (error) {
      console.error("Error tracking user:", error);
    }
  }

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
bot.on("text", async (ctx) => {
  const message = ctx.message.text.toLowerCase();

  // Check for order status requests
  if (message.includes("my orders") || message.includes("recent orders")) {
    await getUserOrders(ctx);
    return;
  }

  // Check if message looks like an order ID (8 characters, alphanumeric)
  const orderIdMatch = message.match(/\b[a-f0-9]{8}\b/i);
  if (orderIdMatch) {
    await checkOrderStatus(ctx, orderIdMatch[0]);
    return;
  }

  // Check if message looks like an order (contains numbers and food words)
  if (
    message.match(
      /\d+.*(?:burger|fries|coffee|drink|salad|classic|cheese|bacon)/i
    )
  ) {
    const orderProcessed = await processOrderText(ctx, message);
    if (orderProcessed) {
      return;
    }
  }

  // Default responses for common messages
  if (message.includes("burger") || message.includes("food")) {
    ctx.reply("🍔 Hungry? Check out our /menu or place an /order!");
  } else if (message.includes("order")) {
    ctx.reply(
      "📋 Use /order to place an order or /status to check your order status."
    );
  } else if (message.includes("status")) {
    ctx.reply(
      '🔍 Use /status to check your order status or type "my orders" to see recent orders.'
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

// Validate Firebase configuration (optional - bot can run without Firebase)
if (!validateFirebaseConfig()) {
  console.warn(
    "⚠️ Firebase configuration is incomplete. Some features may not work."
  );
  console.warn("Please check your Firebase environment variables in .env file");
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
