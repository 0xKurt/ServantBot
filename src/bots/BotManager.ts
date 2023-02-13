import IBot from "./IBot";
import pc from "picocolors";
import { CoinData } from "../types";

class BotManager {
  private bots: IBot[];

  constructor() {
    this.bots = [];
    console.log("\n   ", pc.underline("BotManager initialized"));
  }

  registerBot(bot: IBot) {
    this.bots.push(bot);
    console.log(`     ${pc.green("✓")} Bot registered: ${bot.name()}`);
  }

  sendMessage(data: CoinData): void {
    for (const bot of this.bots) {
      bot.sendMessage(data);
    }
  }
}

export default BotManager;
