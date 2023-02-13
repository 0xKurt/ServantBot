import { CoinData } from "../types";

interface IBot {
  sendMessage(data: CoinData): void;
  name(): string;
}

export default IBot;