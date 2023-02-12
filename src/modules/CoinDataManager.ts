import { CoinData } from "../../types";
import ICoinDataModule from "./IncomingCoinData/ICoinDataModule";
import pc from "picocolors"

class CoinDataManager {
  private apiModules: ICoinDataModule[];

  constructor() {
    this.apiModules = [];
    console.log("\n   ", pc.underline("CoinDataManager initialized"))
  }

  registerModule(module: ICoinDataModule) {
    this.apiModules.push(module);
   console.log(`     ${pc.green("✓")} Module registered: ${module.name()}`);
  }

  async callApis(): Promise<CoinData[] | null> {
    const allResults: Array<CoinData[] | null> = [];

    for (const module of this.apiModules) {
      const data = await module.fetchResults();
      if (data && data?.length > 0) {
        allResults.push(data);
      }
    }

    if (allResults.length > 0) return mergeCoinData(allResults);
    return null;
  }
}

function mergeCoinData(arrays: Array<CoinData[] | null>): CoinData[] {
  const mergedCoinData: CoinData[] = [];

  arrays?.forEach((array) => {
    array?.forEach((obj) => {
      const index = mergedCoinData.findIndex((cd) => obj.symbol === cd.symbol);

      if (index === -1) {
        mergedCoinData.push(obj);
      } else {
        const coinData = mergedCoinData[index] as Record<string, any>;
        for (const [key, value] of Object.entries(obj)) {
          if (coinData[key] === null || coinData[key] === undefined || coinData[key] === "") {
            coinData[key] = value;
          }
        }
      }
    });
  });

  return mergedCoinData;
}

export default CoinDataManager;
