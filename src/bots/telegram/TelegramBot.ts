import { Telegraf } from "telegraf";
import fs from "fs";
import IBot from "../IBot";
import { CoinData } from "../../types";
import axios from "axios";

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
    return "Telegram Bot v1.0.0";
  }

  public start(): void {
    this.bot.launch();
  }

  // styling: https://core.telegram.org/bots/api#html-style
  public sendMessage(data: CoinData): void {
    const message =
      `<b>New listing: ${data.name} (${data.symbol})</b>${BREAK}` +
      `Network: ${data.network}${BREAK}` +
      `Address: ${data.address}${BREAK}` +
      `Date added: ${data.dateAdded}${BREAK}` +
      `Date launched: ${data.dateLaunched}${BREAK}` +
      `Website: ${data.website}${BREAK}` +
      `Twitter: ${data.twitter}${BREAK}`;

    for (const groupId of this.groupList) {
      this.send(message, groupId);
    }
  }

  private send(text: string, groupId: string): void {
    this.bot.telegram.sendMessage(groupId, text, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
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
        if (update.message && update.message.chat.type === "group") {
          this.groupList.add(update.message.chat.id.toString());
        }
      }
      this.saveGroupList();
    }
  }
}

export default TelegramBot;
