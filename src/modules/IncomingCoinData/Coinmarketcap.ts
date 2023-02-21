import axios from "axios";
import { getChainId } from "../../../chainId";

import { CoinData } from "../../types";
import ICoinDataModule from "./ICoinDataModule";

class Coinmarketcap implements ICoinDataModule {
  lastResult: any;

  constructor() {
    // Do any setup here
    this.init();
  }

  async init(): Promise<void> {
    const apiData: any = await getCoinData();
    const data: any = apiData?.data;
    this.lastResult = data[1];
  }

  name(): string {
    return "Coinmarketcap Module";
  }

  async fetchResults(): Promise<CoinData[] | null> {
    // Call the API here and return the transformed data in the common format

    const apiData: any = await getCoinData();
    const data: any = apiData?.data;

    const newListings = this.findNewListings(data);

    if (newListings.length > 0) {

      let metaData = null;
      let retries = 0;
      const maxRetries = 5;
      const retryInterval = 5 * 60 * 1000; // 5 minutes in milliseconds

      while (!metaData && retries < maxRetries) {
        if (retries > 0) {
          console.log(
            `Failed to get metadata. Retrying in ${
              retryInterval / 1000
            } seconds...`
          );
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }
        
        metaData = await getMetaData(newListings);
        if(!metaData) retries++;
      }

      const coinData = generalizeData(newListings, metaData);
      return coinData;
    }

    return null;
  }

  findNewListings(data: any[]): any[] {
    const newListings: any[] = [];

    if (data?.length > 0) {
      if (data[0].id !== this.lastResult.id) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === this.lastResult.id) {
            break;
          }
          newListings.push(data[i]);
        }
        this.lastResult = data[0];
      }
    }
    return newListings;
  }
}

const generalizeData = (newListings: any[], metaData: any): CoinData[] => {
  const coinData: CoinData[] = [];

  for (let i = 0; i < newListings.length; i++) {
    const listing = newListings[i];

    const meta = metaData[listing.id];
    const tmpData: CoinData = {
      symbol: listing.symbol,
      name: listing.name,
      address: listing?.platform?.token_address,
      network: listing?.platform?.name,
      networkId: getChainId(listing?.platform?.name),
      dateAdded: listing.date_added,
      dateLaunched: listing?.date_launched || listing.date_added,
      website: meta?.urls?.website[0],
      twitter: meta?.urls?.twitter[0],
      twitterUser: meta?.twitter_username,
      cmc: `https://coinmarketcap.com/currencies/${meta?.slug}`,
    };

    coinData.push(tmpData);
  }
  return coinData;
};

const getMetaData = async (newListings: any[]): Promise<any> => {
  let response: any;

  let ids: string[] = [];

  for (let i = 0; i < newListings.length; i++) {
    ids.push(newListings[i].id);
  }

  const idString = ids.join(",");

  try {
    response = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${idString}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
        },
      }
    );
  } catch (ex) {
    console.error(ex);
    return null;
  }
  if (response) {
    const json = response.data;
    return json.data;
  }
};

const getCoinData = async (): Promise<any | null> => {
  let response: any;
  try {
    response = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${
        process.env.COINMARKETCAP_RESULT_COUNT || "10"
      }&sort=date_added&sort_dir=desc`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
        },
      }
    );
  } catch (ex) {
    console.error(ex);
    return null;
  }
  if (response) {
    const json = response.data;
    return json;
  }
  return null;
};

export default Coinmarketcap;
