import dotenv from "dotenv";
import CoinDataManager from "./modules/IncomingCoinData/CoinDataManager";
import Coinmarketcap from "./modules/IncomingCoinData/Coinmarketcap";
import DummyModule from "./modules/IncomingCoinData/DummyModule";
import pc from "picocolors";
import { timeNow } from "./utils";
import BotManager from "./bots/BotManager";
import TelegramBot from "./bots/telegram/TelegramBot";
import ModifierManager from "./modules/DatasetModifier/ModifierManager";
import TwitterModifier from "./modules/DatasetModifier/TwitterModifier";

dotenv.config();

console.log(pc.green(pc.bold("🤖 TokenServantBot started")));

// CoinDataManager is a class that will call all the APIs and merge the data together
// It will also filter out any duplicate data
// It will also filter out any data that is not in the common format
// It will also filter out any data that is missing required fields
// return type: Promise<CoinData[] | null>
const coinDataManager = new CoinDataManager();

// Register all the APIs here
coinDataManager.registerModule(new Coinmarketcap());
// coinDataManager.registerModule(new DummyModule(0));
// coinDataManager.registerModule(new DummyModule(1));

// Register all the bots here
const botManager = new BotManager();

// Telegram bot
// You can set the TELEGRAM_API_KEY environment variable to enable the telegram bot
let telegramBot: TelegramBot | null = null;
if (process.env.TELEGRAM_API_KEY) {
  telegramBot = new TelegramBot(process.env.TELEGRAM_API_KEY);
  botManager.registerBot(telegramBot);
}

// Modifiers are used to modify the data before it is sent to the bots
const modManager = new ModifierManager();

// Register all the modifiers here
modManager.registerMod(new TwitterModifier()); // add followers count

// ===> Main loop
// This will run every 10 minutes by default
// You can change the interval by setting the RUN_INTERVAL_MINUTES environment variable
// The interval is in minutes
// Example: RUN_INTERVAL_MINUTES=5 will run the loop every 5 minutes
const task = async () => {
  // Get latest coin data
  const result = await coinDataManager.callApis();
  if (result) {
    // Send the data to all the bots
    result.forEach(async (data) => {
      let modData = data;
      modData = await modManager.applyChanges(data);
      await botManager.sendMessage(modData);
    });
  }
};

const onStartup = async () => {
  if (process.env.PRODUCTION === "true" && telegramBot)
    await telegramBot.sendText(
      `🤖 <b>TokenServantBot</b> 🤖 \nstarted at ${timeNow()}\n\nI will send the last dataset again to test my functionality.`
    );
  await task();
};

setTimeout(async () => {
  await onStartup();
}, 10 * 1000);

setInterval(
  task,
  (process.env.RUN_INTERVAL_MINUTES
    ? parseInt(process.env.RUN_INTERVAL_MINUTES, 10)
    : 10) *
    60 *
    1000
);
