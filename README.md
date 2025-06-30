# SiBurger Bot 🍔

A Telegram bot built with Telegraf.js and TypeScript for a burger restaurant, with Firebase integration for order management.

## Features

- 🍔 Display burger menu
- 📋 Handle order inquiries and process orders
- 🔍 Order status checking with Firebase
- 💬 Interactive conversation
- 👥 User tracking and order history
- 🚀 Built with TypeScript for type safety
- 🔥 Firebase Firestore for data persistence

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Telegram Bot Token from [@BotFather](https://t.me/BotFather)
- Firebase project with Firestore enabled

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

4. Edit `.env` file and add your bot token and Firebase configuration:
   ```
   BOT_TOKEN=your_actual_bot_token_here
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   ```

### Getting a Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Start a chat and send `/newbot`
3. Follow the instructions to create your bot
4. Copy the provided token to your `.env` file

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate a new private key (JSON file)
6. Copy the `project_id`, `private_key`, and `client_email` to your `.env` file

**Note:** The bot can run without Firebase, but order management features will be disabled.

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
- `/order` - Get ordering information or place an order
- `/status` - Check order status

## Enhanced Features with Firebase

- **Order Management**: Place orders directly through the bot
- **Order Tracking**: Check order status with order ID
- **User History**: View your recent orders
- **Smart Parsing**: Natural language order processing

### Order Examples

```
"1 Classic Beef, 2 French Fries, 1 Coffee"
"2 cheeseburgers and 1 side salad"
"one bbq bacon burger with fries"
```

## Project Structure

```
src/
├── index.ts          # Main bot file
├── commands/         # Command handlers
│   ├── start.ts
│   ├── help.ts
│   ├── menu.ts
│   ├── order.ts      # Enhanced with Firebase
│   └── status.ts     # Enhanced with Firebase
└── utilities/        # Utility functions
    ├── firebase.ts   # Firebase configuration
    └── database.ts   # Database operations
```

## Environment Variables

### Required

- `BOT_TOKEN` - Your Telegram bot token

### Firebase (Optional)

- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase private key
- `FIREBASE_CLIENT_EMAIL` - Firebase client email

### Optional

- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Port for webhook mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License
