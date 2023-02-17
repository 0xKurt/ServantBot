import { CoinData } from "../../types";
import ICoinDataModule from "./ICoinDataModule";

class DummyModule implements ICoinDataModule {

  out: number = 0;
  constructor(n: number) {
    this.out = n;
  }

  name(): string {
    return `Dummy Module - ${this.out}`;
  }

  async fetchResults(): Promise<CoinData[] | null> {
    if(this.out === 0)
    return [
      {
        symbol: 'TEST',
        name: "",
        address: '0x1234567890987654321234567890987654321234',
        network: 'BNB',
        dateAdded: '2023-02-11T16:47:24.000Z',
        dateLaunched: '2023-02-09T00:00:00.000Z',
        website: 'cmc: undefined website?',
        twitter: 'https://twitter.com/test',
        twitterUser: undefined,
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
        twitterUser: 'AABBCCDD',
      }
    ];

    if(this.out === 1)
    return [
      {
        symbol: 'DUMMY',
        name: 'Dummy Inu',
        address: '0xabcdefga0987654321234567890987654321234',
        network: 'arb',
        dateAdded: '2023-02-11T17:00:19.000Z',
        dateLaunched: '2023-02-10T00:00:00.000Z',
        website: 'https://aionmars.finance/',
        twitter: 'https://twitter.com/AIonMars_AI',
        twitterUser: 'AIonMars_AI',
      },
      {
        symbol: 'TEST',
        name: 'Test Moon',
        address: null,
        network: 'BNB',
        dateAdded: '2023-02-11T16:47:24.000Z',
        dateLaunched: '2023-02-09T00:00:00.000Z',
        website: 'https://test.com',
        twitter: 'https://twitter.com/test',
        twitterUser: 'test',
      }
    ];
    
    return null;
  }
}

export default DummyModule;