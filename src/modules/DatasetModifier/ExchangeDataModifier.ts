import axios from "axios";

import { CoinData, ExchangeData } from "../../types";
import IModifier from "./IModifier";

class ExchangeDataModifier implements IModifier {
  async applyChanges(data: CoinData): Promise<CoinData> {
    let newData = data;

    if (newData.cmc) {
      const ex: ExchangeData[] | null = await getExData(newData.cmc.replace("https://coinmarketcap.com/currencies/",""));
      if (ex && ex?.length > 0) newData.exchangeData = ex;
    }

    return newData;
  }

  name = () => {
    return "ExchangeData Modifier";
  };
}

const getExData = async (slug: string): Promise<ExchangeData[] | null> => {
  let response: any;
  try {
    response = await axios.get(
      `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/market-pairs/latest?slug=${slug}&start=1&limit=6&category=spot&centerType=all&sort=cmc_rank_advanced`
    );
  } catch (ex) {
    console.error(ex);
    return null;
  }
  if (response) {
    const exData: ExchangeData[] = [];

    response.data.data.marketPairs.forEach((element: any) => {
      const ex: ExchangeData = {
        name: element.exchangeName,
        pairContract: element.pairContractAddress || null,
        price: element.price,
        liquidity: element.liquidity,
      };
      exData.push(ex);
    });

    return exData;
  }
  return null;
};

export default ExchangeDataModifier;
