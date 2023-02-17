import { CoinData } from "../../types";

interface IModifier {
  applyChanges(data: CoinData): Promise<CoinData>;
  name(): string;
}

export default IModifier;