import { Context } from "telegraf";
import { User, UsersService } from "../utilities/database";

export async function menuCommand(ctx: Context) {
  const sender = ctx.from;
  if (!sender) {
    ctx.reply("❌ Error: Unable to retrieve user information.");
    return;
  }
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
  // create user from sender
  const user: User = {
    id: sender.id,
    firstName: sender.first_name,
    lastName: sender.last_name,
    username: sender.username,
    createdAt: new Date(),
    lastActive: new Date(),
    orderCount: 0,
  };

  // Save or update user in the database
  await UsersService.createOrUpdateUser(user);

  ctx.reply(menu, { parse_mode: "Markdown" });
}
