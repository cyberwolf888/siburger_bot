import { Context } from "telegraf";

export function menuCommand(ctx: Context) {
  const menu = `
🍔 **SiBurger Menu** 🍔

**Classic Burgers:**
🍔 Classic Beef - $8.99
🍔 Cheeseburger - $9.99
🍔 Double Cheese - $12.99

**Gourmet Burgers:**
🍔 BBQ Bacon - $13.99
🍔 Mushroom Swiss - $11.99
🍔 Spicy Jalapeño - $10.99

**Sides:**
🍟 French Fries - $3.99
🧅 Onion Rings - $4.99
🥗 Side Salad - $5.99

**Drinks:**
🥤 Soft Drinks - $2.99
🧃 Fresh Juice - $3.99
☕ Coffee - $2.49
  `;
  ctx.reply(menu, { parse_mode: "Markdown" });
}
