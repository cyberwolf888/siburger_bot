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
- **Environment**: dotenv for configuration
- **Build**: TypeScript compiler with strict mode

### Project Structure

```
src/
├── index.ts          # Main bot entry point with all handlers
├── types/            # TypeScript definitions (future expansion)
├── commands/         # Command handlers (future modularization)
├── middleware/       # Custom middleware (future expansion)
└── utils/            # Utility functions (future expansion)
```

### Current Implementation

- Single-file bot implementation in `src/index.ts`
- Polling-based message handling (no webhooks configured)
- Basic command handlers: `/start`, `/help`, `/menu`, `/order`, `/status`
- Text message processing with keyword detection
- Graceful shutdown handling (SIGINT/SIGTERM)

## Environment Configuration

### Required Variables

- `BOT_TOKEN` - Telegram bot token from @BotFather (required)

### Optional Variables

- `NODE_ENV` - Environment mode (development/production)
- `PORT` - For future webhook implementation

### Environment Setup

- Copy `.env.example` to `.env` and configure variables
- Validate `BOT_TOKEN` presence before bot launch

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

## Bot Development Patterns

### Command Handlers

```typescript
bot.command("commandname", (ctx) => {
  // Handle command logic
  ctx.reply("Response message");
});
```

### Message Processing

- Use `bot.on("text", callback)` for text message handling
- Implement keyword-based responses with `message.toLowerCase().includes()`
- Provide helpful fallback responses

### Error Handling

- Use `bot.catch()` for global error handling
- Log errors to console with context
- Provide user-friendly error messages
- Validate environment variables before bot launch

### Shutdown Handling

- Implement graceful shutdown for SIGINT/SIGTERM
- Call `bot.stop()` with signal name
- Exit process after cleanup

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
