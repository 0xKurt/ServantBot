import { CoinData } from "../types";

interface IBot {
  sendMessage(data: CoinData): Promise<void>;
  name(): string;
}

export default IBot;