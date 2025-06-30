import { Context } from "telegraf";
import { OrdersService } from "../utilities/database";

export function statusCommand(ctx: Context) {
  ctx.reply(
    "🔍 **Check Order Status**\n\n" +
      "📝 Reply with your order ID to check status\n" +
      "💡 Your order ID was provided when you placed the order\n\n" +
      '📋 Or type "my orders" to see your recent orders'
  );
}

export async function checkOrderStatus(
  ctx: Context,
  orderId: string
): Promise<boolean> {
  try {
    const order = await OrdersService.getOrder(orderId.toLowerCase());

    if (!order) {
      ctx.reply(
        "❌ Order not found. Please check your order ID and try again."
      );
      return false;
    }

    // Check if the order belongs to the user
    if (order.userId !== ctx.from?.id) {
      ctx.reply("❌ This order doesn't belong to you.");
      return false;
    }

    const statusEmoji = {
      pending: "⏳",
      confirmed: "✅",
      preparing: "👨‍🍳",
      ready: "🔔",
      delivered: "🎉",
      cancelled: "❌",
    };

    const orderItems = order.items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");

    ctx.reply(
      `${statusEmoji[order.status]} **Order Status**\n\n` +
        `**Order ID:** ${orderId.toUpperCase()}\n` +
        `**Status:** ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}\n` +
        `**Items:** ${orderItems}\n` +
        `**Total:** $${order.totalAmount.toFixed(2)}\n` +
        `**Ordered:** ${order.createdAt.toLocaleString()}\n\n` +
        getStatusMessage(order.status),
      { parse_mode: "Markdown" }
    );

    return true;
  } catch (error) {
    console.error("Error checking order status:", error);
    ctx.reply(
      "❌ Sorry, there was an error checking your order status. Please try again."
    );
    return false;
  }
}

export async function getUserOrders(ctx: Context): Promise<void> {
  if (!ctx.from) {
    ctx.reply("❌ Unable to retrieve your orders. Please try again.");
    return;
  }

  try {
    const orders = await OrdersService.getUserOrders(ctx.from.id);

    if (orders.length === 0) {
      ctx.reply(
        "📋 You haven't placed any orders yet. Use /order to place your first order!"
      );
      return;
    }

    const recentOrders = orders.slice(0, 5); // Show last 5 orders
    const ordersList = recentOrders
      .map((order) => {
        const statusEmoji = {
          pending: "⏳",
          confirmed: "✅",
          preparing: "👨‍🍳",
          ready: "🔔",
          delivered: "🎉",
          cancelled: "❌",
        };

        return `${statusEmoji[order.status]} **${order.id?.substring(0, 8).toUpperCase()}** - $${order.totalAmount.toFixed(2)} (${order.status})`;
      })
      .join("\n");

    ctx.reply(
      `📋 **Your Recent Orders:**\n\n${ordersList}\n\n` +
        `💡 Reply with an order ID to see full details`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    ctx.reply(
      "❌ Sorry, there was an error retrieving your orders. Please try again."
    );
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case "pending":
      return "⏳ Your order is being reviewed. We'll confirm it shortly!";
    case "confirmed":
      return "✅ Your order has been confirmed and will be prepared soon!";
    case "preparing":
      return "👨‍🍳 Your delicious meal is being prepared right now!";
    case "ready":
      return "🔔 Your order is ready for pickup or will be delivered soon!";
    case "delivered":
      return "🎉 Your order has been delivered! Enjoy your meal!";
    case "cancelled":
      return "❌ This order has been cancelled. Contact us if you have questions.";
    default:
      return "❓ Status unknown. Please contact us for more information.";
  }
}
