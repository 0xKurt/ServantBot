export type CoinData = {
  symbol: string;
  name: string;
  address?: string | null;
  network?: string | null;
  networkId?: number | null;
  dateAdded: string;
  dateLaunched?: string | null;
  website?: string | null;
  twitter?: string | null;
  twitterUser?: string | null;
  cmc?: string | null;
  twitterStats?: TwitterStats;
}

export type TwitterStats = {
  followers?: number;
  createdAt?: string;
  verified?: boolean;
  statusCount?: number;
}


