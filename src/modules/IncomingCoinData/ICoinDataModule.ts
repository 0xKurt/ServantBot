import { CoinData } from "../../../types";

interface ICoinDataModule {
  fetchResults(): Promise<CoinData[] | null>;
  name(): string;
}

export default ICoinDataModule;