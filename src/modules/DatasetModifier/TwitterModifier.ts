import axios from "axios";

import { CoinData, TwitterStats } from "../../types";
import IModifier from "./IModifier";

const followerRegex = /"followers_count":(\d+),/;

class TwitterModifier implements IModifier {
  async applyChanges(data: CoinData): Promise<CoinData> {
    let newData = data;

    if (newData.twitterUser) {
      const stats: TwitterStats | null = await getStats(newData.twitterUser);
      if (stats) newData.twitterStats = stats;
    }

    return newData;
  }

  name = () => {
    return "Twitter Modifier";
  };
}

const getStats = async (user: string): Promise<TwitterStats | null> => {
  let response: any;
  try {
    response = await axios.get(
      `${process.env.TWITTER_API}${user}`
    );
  } catch (ex) {
    console.error(ex);
    return null;
  }
  if (response) {
    const stats: TwitterStats = {
      followers: response.data["followers_count"],
      createdAt: response.data["created_at"],
      verified: response.data["verified"],
      statusCount: response.data["statuses_count"],
    };

    return stats;
  }
  return null;
};

export default TwitterModifier;
