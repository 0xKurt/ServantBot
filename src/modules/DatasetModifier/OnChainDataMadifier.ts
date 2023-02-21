import axios from "axios";
import { CoinData } from "../../types";
import IModifier from "./IModifier";

class OnChainDataModifier implements IModifier {
  async applyChanges(data: CoinData): Promise<any> {
    let newData: CoinData = data;
    
    if(newData.networkId && newData.networkId != -1 && newData.address) {
      const count: number = await getHolderInformation(newData.networkId, newData.address);
      newData.onChainData = {
        tokenHolderCount: count
      }
    }
    
    return newData;
  }

  name = () => {
    return "OnChainData Modifier";
  };
}

const getHolderInformation = async (
  networkId: number,
  address: string
): Promise<number> => {
  let response: any;
  try {
    response = await axios.get(
      `https://api.covalenthq.com/v1/${networkId}/tokens/${address}/token_holders/?quote-currency=USD&format=JSON&page-size=10000`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COVALENT_API_KEY}`,
        },
      }
    );
    if(Boolean(response.data.error)) {
      return 0;
    } else {
      return response.data.data.items.length;
    }
  } catch (ex) {
    console.error(ex);
    return 0;
  }
};

export default OnChainDataModifier;
