# SiBurger Bot 🍔

A Telegram bot built with Telegraf.js and TypeScript for a burger restaurant.

## Features

- 🍔 Display burger menu
- 📋 Handle order inquiries
- 🔍 Order status checking
- 💬 Interactive conversation
- 🚀 Built with TypeScript for type safety

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Telegram Bot Token from [@BotFather](https://t.me/BotFather)

### Installation

1. Clone or download this project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file and add your bot token:
   ```
   BOT_TOKEN=your_actual_bot_token_here
   ```

### Getting a Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Start a chat and send `/newbot`
3. Follow the instructions to create your bot
4. Copy the provided token to your `.env` file

## Development

### Run in development mode (with auto-reload):

```bash
npm run dev
```

### Build the project:

```bash
npm run build
```

### Run the built project:

```bash
npm start
```

### Code Quality

This project uses ESLint and Prettier for code quality and formatting.

#### Linting

```bash
# Check for linting errors
npm run lint

# Fix auto-fixable linting errors
npm run lint:fix
```

#### Formatting

```bash
# Format code with Prettier
npm run format

# Check if code is formatted correctly
npm run format:check
```

## Bot Commands

- `/start` - Welcome message
- `/help` - Show available commands
- `/menu` - Display burger menu
- `/order` - Get ordering information
- `/status` - Check order status

## Project Structure

```
src/
├── index.ts          # Main bot file
├── types/            # TypeScript type definitions (future)
├── commands/         # Command handlers (future)
├── middleware/       # Custom middleware (future)
└── utils/            # Utility functions (future)
```

## Environment Variables

- `BOT_TOKEN` - Your Telegram bot token (required)
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Port for webhook mode (optional)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License
