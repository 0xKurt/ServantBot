import { CoinData } from "../../types";
import ICoinDataModule from "./ICoinDataModule";

class DummyModule implements ICoinDataModule {

  out: number = 0;
  constructor(n: number) {
    this.out = n;
  }

  name(): string {
    return `Dummy Module v1.0.0 - ${this.out}`;
  }

  async fetchResults(): Promise<CoinData[] | null> {
    if(this.out === 0)
    return [
      {
        symbol: 'GENAI',
        name: "",
        address: '0x260eA2A1710f14D670A37cfA3f57A9CeD6E795e2',
        network: 'BNB',
        dateAdded: '2023-02-11T16:47:24.000Z',
        dateLaunched: '2023-02-09T00:00:00.000Z',
        website: 'cmc: undefined website?',
        twitter: 'https://twitter.com/genieaiart',
        twitter_user: undefined,
        twitterFollowers: 0
      },
      {
        symbol: 'AABBCCDD',
        name: 'AABBCCDD',
        address: null,
        network: undefined,
        dateAdded: '2023-02-11T16:47:24.000Z',
        dateLaunched: null,
        website: 'https://www.AABBCCDD.art/',
        twitter: 'https://twitter.com/AABBCCDD',
        twitter_user: 'AABBCCDD',
        twitterFollowers: 0
      }
    ];

    if(this.out === 1)
    return [
      {
        symbol: 'AIONMARS',
        name: 'AIon Mars',
        address: '0xa2214039c2ccb9b86d351000ba2f126f45ce44a4',
        network: 'BNB',
        dateAdded: '2023-02-11T17:00:19.000Z',
        dateLaunched: '2023-02-10T00:00:00.000Z',
        website: 'https://aionmars.finance/',
        twitter: 'https://twitter.com/AIonMars_AI',
        twitter_user: 'AIonMars_AI',
        twitterFollowers: 0
      },
      {
        symbol: 'GENAI',
        name: 'Genie AI',
        address: null,
        network: 'BNB',
        dateAdded: '2023-02-11T16:47:24.000Z',
        dateLaunched: '2023-02-09T00:00:00.000Z',
        website: 'https://genieart.com',
        twitter: 'https://twitter.com/genieaiart',
        twitter_user: 'geniart',
        twitterFollowers: 0
      }
    ];
    
    return null;
  }
}

export default DummyModule;