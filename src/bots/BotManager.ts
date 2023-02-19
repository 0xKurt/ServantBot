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
      // console.log(`     ${pc.green("✓")} Sending data to bot: ${bot.name()}`, data);
      if (process.env.PRODUCTION === "true") {
        await bot.sendMessage(data);
      } else {
        console.log(
          `     ${pc.green(">")} Sending data to bot: ${bot.name()} \n${data}`,
          data
        );
      }
    }
  }
}

export default BotManager;
