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

  async sendMessage(data: CoinData): Promise<void> {
    for (const bot of this.bots) {
        await bot.sendMessage(data);
    }
  }
}

export default BotManager;
