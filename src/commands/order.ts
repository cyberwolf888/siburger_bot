import { Context } from "telegraf";
import { OrdersService, getAllMenuItems } from "../utilities/database";

export function orderCommand(ctx: Context) {
  ctx.reply(
    "📋 To place an order:\n\n" +
      "🛒 **Quick Order:** Reply with item names from our menu\n" +
      'Example: "1 Classic Beef, 2 French Fries, 1 Coffee"\n\n' +
      "📞 **Phone Orders:** +1 (555) 123-4567\n" +
      "🌐 **Website:** www.siburger.com\n" +
      "📍 **Address:** 123 Burger Street, Food City\n\n" +
      "Type /menu to see all available items!",
    { parse_mode: "Markdown" }
  );
}

// Enhanced function to parse and create orders from text
export async function processOrderText(
  ctx: Context,
  orderText: string
): Promise<boolean> {
  if (!ctx.from) {
    ctx.reply("❌ Unable to process order. Please try again.");
    return false;
  }

  try {
    const menuItems = getAllMenuItems();
    const orderItems = [];
    let totalAmount = 0;

    // Simple parsing logic - look for patterns like "1 Classic Beef", "2 fries", etc.
    const orderPattern = /(\d+)\s+([a-zA-Z\s]+)/g;
    let match;

    while ((match = orderPattern.exec(orderText)) !== null) {
      const quantity = parseInt(match[1]);
      const itemName = match[2].trim().toLowerCase();

      // Find matching menu item
      const menuItem = menuItems.find(
        (item) =>
          item.name.toLowerCase().includes(itemName) ||
          itemName.includes(item.name.toLowerCase())
      );

      if (menuItem && quantity > 0) {
        orderItems.push({
          name: menuItem.name,
          price: menuItem.price,
          quantity,
        });
        totalAmount += menuItem.price * quantity;
      }
    }

    if (orderItems.length === 0) {
      ctx.reply(
        "❌ I couldn't find any valid items in your order.\n" +
          "Please check the spelling and try again. Use /menu to see available items."
      );
      return false;
    }

    // Create order in Firebase
    const orderId = await OrdersService.createOrder({
      userId: ctx.from.id,
      username: ctx.from.username,
      items: orderItems,
      totalAmount,
      status: "pending",
    });

    // Format order confirmation
    const orderSummary = orderItems
      .map(
        (item) =>
          `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`
      )
      .join("\n");

    ctx.reply(
      `✅ **Order Confirmed!**\n\n` +
        `**Order ID:** ${orderId.substring(0, 8).toUpperCase()}\n\n` +
        `**Items:**\n${orderSummary}\n\n` +
        `**Total: $${totalAmount.toFixed(2)}**\n\n` +
        `📞 We'll contact you shortly to confirm your order!\n` +
        `Use /status with your order ID to check progress.`,
      { parse_mode: "Markdown" }
    );

    return true;
  } catch (error) {
    console.error("Error processing order:", error);
    ctx.reply(
      "❌ Sorry, there was an error processing your order. Please try again or contact us directly."
    );
    return false;
  }
}
