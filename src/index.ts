import dotenv from "dotenv";
import CoinDataManager from "./modules/CoinDataManager";
import Coinmarketcap from "./modules/IncomingCoinData/Coinmarketcap";
import DummyModule from "./modules/IncomingCoinData/DummyModule";
import pc from "picocolors";
import { timeNow } from "./utils";

dotenv.config();

console.log(pc.green(pc.bold("🤖 ServantBot v0.0.1 started")));

// CoinDataManager is a class that will call all the APIs and merge the data together
// It will also filter out any duplicate data
// It will also filter out any data that is not in the common format
// It will also filter out any data that is missing required fields
// return type: Promise<CoinData[] | null>
const coinDataManager = new CoinDataManager();

// Register all the APIs here
// coinDataManager.registerModule(new Coinmarketcap());
coinDataManager.registerModule(new DummyModule(0));
coinDataManager.registerModule(new DummyModule(1));


// ===> Main loop
// This will run every 10 minutes by default
// You can change the interval by setting the RUN_INTERVAL_MINUTES environment variable
// The interval is in minutes
// Example: RUN_INTERVAL_MINUTES=5 will run the loop every 5 minutes
const task = async () => {
  // console.log(timeNow());
  const result = await coinDataManager.callApis();
  if (result) {
    console.log("===> new results");
   console.log(result);
  }
  // add broadcasting for telegram etc.. here
};

setInterval(
  task,
  (process.env.RUN_INTERVAL_MINUTES
    ? parseInt(process.env.RUN_INTERVAL_MINUTES, 10)
    : 10) *
    60 *
    1000
);
