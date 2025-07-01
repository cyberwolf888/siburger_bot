# SiBurger Bot - Copilot Instructions

## Core Commands

- `npm run dev` - Development mode with auto-reload using nodemon + ts-node
- `npm run build` - TypeScript compilation to `dist/` directory
- `npm start` - Run compiled bot from `dist/index.js`
- `npm test` - Currently placeholder (no tests configured)
- `npm run lint` - Check for ESLint errors
- `npm run lint:fix` - Fix auto-fixable ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly

## Architecture

### Tech Stack

- **Runtime**: Node.js with TypeScript
- **Bot Framework**: Telegraf.js v4.16.3
- **Database**: Firebase Firestore for orders and user tracking
- **Environment**: `dotenv` for local configuration, Google Secret Manager for production.
- **Deployment**: Docker container deployed to Google Compute Engine (GCE) via Cloud Build.
- **Build**: TypeScript compiler with strict mode

### Project Structure

```
src/
├── index.ts          # Main bot entry point with middleware and routing
├── commands/         # Modular command handlers
│   ├── start.ts      # Welcome command
│   ├── help.ts       # Help command
│   ├── menu.ts       # Menu display with user tracking
│   ├── order.ts      # Order processing with Firebase integration
│   └── status.ts     # Order status checking and user order history
└── utilities/        # Core utilities
    ├── firebase.ts   # Firebase Admin SDK setup and validation
    └── database.ts   # Firestore operations and data models
```

### Current Implementation

- **Modular Architecture**: Commands separated into individual files with clear exports
- **Firebase Integration**: Full order management with Firestore persistence
- **Smart Order Processing**: Natural language parsing in `processOrderText()`
- **User Tracking**: Automatic user creation/updates via middleware
- **Polling-based**: No webhooks configured (uses `bot.launch()`)
- **Graceful Shutdown**: SIGINT/SIGTERM handling with `bot.stop()`

## Environment Configuration

### Required Variables

- `BOT_TOKEN` - Telegram bot token from @BotFather (required)

### Firebase Configuration (Optional - bot runs without it)

- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key (with escaped newlines)
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_DATABASE_ID` - Firestore database ID (e.g., "siburger")

### Optional Variables

- `NODE_ENV` - Environment mode (development/production)
- `PORT` - For future webhook implementation

### Environment Setup

- Firebase configuration is validated in `validateFirebaseConfig()` - bot warns but continues if incomplete
- Private key requires `\\n` escaping in `.env` file, automatically converted in `firebase.ts`
- Bot validates `BOT_TOKEN` presence before launch and exits if missing

## TypeScript Configuration

### Compiler Options (tsconfig.json)

- Target: ES2020 with CommonJS modules
- Strict mode enabled with additional safety checks
- Source maps and declarations generated
- Output to `dist/` directory
- `noImplicitReturns` and `noFallthroughCasesInSwitch` enabled
- JSON module resolution supported

### Code Style

- Use TypeScript strict mode with ES2020 target
- Import Telegraf types: `Context`, `Update` from telegraf
- Environment variables accessed via `process.env`
- Console logging for debugging and error handling
- Error boundaries with `.catch()` for bot operations
- ESLint with TypeScript plugin and Prettier integration
- Prefer `const` over `let`, arrow functions, and object shorthand
- No unused variables (except prefixed with `_`)
- No explicit `any` types (warn level)

### Prettier Configuration

- Semicolons required
- Double quotes (not single)
- 80 character print width
- 2 spaces indentation
- Trailing commas in ES5 contexts
- LF line endings

## Firebase Integration Patterns

### Database Services Pattern

- Use `OrdersService` and `UsersService` classes for all Firestore operations
- Methods return TypeScript interfaces: `Order`, `User`, `OrderItem`
- Service methods handle error cases and return null for missing documents

### Order Management Flow

```typescript
// Create order with auto-generated ID
const orderId = await OrdersService.createOrder(orderData);

// Order IDs displayed as 8-character uppercase substrings for user-friendly reference
const displayId = orderId.substring(0, 8).toUpperCase();

// Status transitions: pending → confirmed → preparing → ready → delivered
await OrdersService.updateOrderStatus(orderId, "confirmed");
```

### User Tracking Middleware

```typescript
// Automatic user creation/update in index.ts middleware
if (ctx.from) {
  await UsersService.createOrUpdateUser({
    id: ctx.from.id,
    username: ctx.from.username,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name,
  });
}
```

## Bot Development Patterns

### Command Handlers

```typescript
// Export named functions from command files
export function commandName(ctx: Context) {
  ctx.reply("Response message");
}

// Import and register in index.ts
import { commandName } from "./commands/command";
bot.command("command", commandName);
```

### Natural Language Order Processing

- Use regex patterns to parse quantities and item names: `/(\d+)\s+([a-zA-Z\s]+)/g`
- Match against `MENU_ITEMS` from `database.ts` using fuzzy string matching
- Return boolean from `processOrderText()` to indicate successful parsing

### Text Message Routing in index.ts

- Check for "my orders" keywords → `getUserOrders()`
- Match 8-character hex patterns → `checkOrderStatus()`
- Detect order patterns with numbers + food words → `processOrderText()`
- Fallback to keyword-based responses

### Error Handling

- Use `bot.catch()` for global error handling
- Log errors to console with context
- Provide user-friendly error messages
- Validate environment variables before bot launch

### Shutdown Handling

- Implement graceful shutdown for SIGINT/SIGTERM
- Call `bot.stop()` with signal name
- Exit process after cleanup

## Deployment

The application is deployed using a `cloudbuild.yaml` pipeline.

1.  **Build & Push**: A Docker image is built and pushed to Google Artifact Registry.
2.  **Fetch Env Vars**: Production environment variables are fetched from Google Secret Manager and written to a temporary file.
3.  **Deploy to GCE**: The new Docker image is pulled on the GCE instance, and the container is started using the fetched environment variables via the `--env-file` flag.

This setup ensures that secrets are not hardcoded and the deployment is automated.

## Restaurant Domain

### SiBurger Bot Context

- Burger restaurant Telegram bot
- Menu display with pricing in USD
- Order inquiry handling (currently directs to external contact)
- Order status checking functionality
- Emoji usage for visual appeal (🍔, 📋, 🔍, etc.)

### Menu Categories

- Classic Burgers ($8.99-$12.99)
- Gourmet Burgers ($10.99-$13.99)
- Sides ($3.99-$5.99)
- Drinks ($2.49-$3.99)

## Development Guidelines

### File Organization

- Keep main bot logic in `src/index.ts` until complexity requires modularization
- Future expansion: separate commands, middleware, and utilities into dedicated folders
- Use TypeScript interfaces for complex data structures

### Messaging Standards

- Use emojis consistently for visual appeal
- Provide clear command descriptions in help text
- Include pricing in menu displays
- Maintain friendly, restaurant-appropriate tone

### Code Quality

- Validate environment variables at startup
- Handle all async operations with proper error catching
- Use TypeScript types from Telegraf library
- Log important events and errors for debugging

## Future Enhancements

### Potential Features

- Database integration for order management
- Webhook mode for production deployment
- User session management
- Payment processing integration
- Admin commands for menu management

### Testing Strategy

- Unit tests for command handlers
- Integration tests for bot workflow
- Environment variable validation tests
- Error handling scenarios
