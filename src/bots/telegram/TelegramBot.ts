import { Telegraf } from "telegraf";
import fs from "fs";
import IBot from "../IBot";
import { CoinData } from "../../types";
import axios from "axios";
import { beautifyTime, formatLiquidity, olderThanDays } from "../../utils";

const FILENAME = `${process.cwd()}/telegram_group_list.json`;
const BREAK = "\n";

class TelegramBot implements IBot {
  private bot: Telegraf;
  private groupList: Set<string>;
  private token: string;

  constructor(token: string) {
    this.bot = new Telegraf(token);
    this.groupList = this.loadGroupList();
    this.token = token;

    this.fetchUpdates();

    // todo: why is this not working?
    this.bot.use((ctx, next) => {
      if (ctx.message && ctx.message.chat.type === "group") {
        this.groupList.add(ctx.message.chat.id.toString());
        this.send("Bot is now active in: ", ctx.message.chat.id.toString());
        this.saveGroupList();
      }
      next();
    });
  }

  public name(): string {
    return "Telegram Bot";
  }

  public start(): void {
    this.bot.launch();
  }

  public async sendText(data: string): Promise<void> {
    for (const groupId of this.groupList) {
      await this.send(data, groupId);
    }
  }

  // styling: https://core.telegram.org/bots/api#html-style
  public async sendMessage(data: CoinData): Promise<void> {
    let message =
      `<b>💎 New listing 💎\n${data.name} (${data.symbol})</b>${BREAK}` +
      `${data.cmc?.replace("https://", "")}${BREAK}` +
      `${BREAK}Network: ${data.network}${BREAK}` +
      `Address: ${data.address}${BREAK}` +
      `Website: ${data.website?.replace("https://", "")}${BREAK}` +
      `${BREAK}<b>Twitter:</b> ${data.twitter?.replace("https://", "")}${BREAK}`;

    message += this.getTwitterData(data);
    message += this.getLiquidityData(data);

    if (process.env.PRODUCTION === "true") {
      for (const groupId of this.groupList) {
        await this.send(message, groupId);
      }
    } else {
      console.log("Telegram bot send:")
      console.log(message);
    }
  }

  private async send(text: string, groupId: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(groupId, text, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    } catch (error: any) {
      if (
        error.response &&
        error.response.error_code === 400 &&
        error.response.description.includes("supergroup")
      ) {
        this.groupList.delete(groupId);
        this.saveGroupList();
      } else {
        console.log("Error sending telegram message: ", error);
        // handle other errors
      }
    }
  }

  private saveGroupList(): void {
    fs.writeFile(
      FILENAME,
      JSON.stringify(Array.from(this.groupList)),
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  }

  private loadGroupList(): Set<string> {
    try {
      const data = fs.readFileSync(FILENAME);
      return new Set(JSON.parse(data.toString()));
    } catch (error) {
      console.error(error);
      return new Set<string>();
    }
  }

  private async fetchUpdates(): Promise<void> {
    let response: any;

    try {
      response = await axios.get(
        `https://api.telegram.org/bot${this.token}/getUpdates`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (ex) {
      console.error(ex);
      response = null;
    }

    if (response) {
      const json = response.data;
      const updates = json.result;

      for (const update of updates) {
        if (
          update.my_chat_member &&
          (update.my_chat_member.chat.type === "group" ||
            update.my_chat_member.chat.type === "supergroup")
        ) {
          this.groupList.add(update.my_chat_member.chat.id.toString());
        }
      }
      this.saveGroupList();
    }
  }

  private getTwitterData = (data: CoinData) => {
    let message = "";

    if (data.twitterStats) {
      let createdAtEmoji = "⚠️";

      if (
        olderThanDays(data.twitterStats.createdAt, 90) &&
        !olderThanDays(data.twitterStats.createdAt, 180)
      ) {
        createdAtEmoji = "⁉️";
      }
      if (olderThanDays(data.twitterStats.createdAt, 180)) {
        createdAtEmoji = "🔥";
      }

      message +=
        `   Follower: ${data.twitterStats.followers}${BREAK}` +
        `   Created at: ${createdAtEmoji} ${beautifyTime(
          data.twitterStats.createdAt
        )}${BREAK}` +
        `   Verified: ${data.twitterStats.verified}${BREAK}` +
        `   Statuses: ${data.twitterStats.statusCount}${BREAK + BREAK}`;
    }
    return message;
  };

  private getLiquidityData = (data: CoinData) => {
    let message = "";
    if (data.exchangeData) {
      let price = 0;
      let liquidity = 0;

      data.exchangeData.forEach((exchange) => {
        price += exchange.price;
        liquidity += exchange.liquidity;
      });

      message +=
        `${BREAK}<b>Liquidity:</b> ${BREAK}` +
        `   Exchanges: ${data.exchangeData.length}${BREAK}` +
        `   Price: $${price > 1 ? price.toFixed(2) : price}${BREAK}` +
        `   Liquidity: $${formatLiquidity(liquidity)}${BREAK + BREAK}`;
    }
    return message;
  };
}

export default TelegramBot;
