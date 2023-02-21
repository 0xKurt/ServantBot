export const getChainId = (name: string): number => {
  switch(name.toLowerCase()) {
    case "binance":
    case "bnb":
    case "bsc":
      return 56;
    case "ethereum":
    case "eth":
      return 1;
    case "polygon":
    case "matic":
      return 137;
    case "avalanche":
    case "avax":
      return 43114;
    case "moonbeam":
    case "glmr":
      return 1284;
    case "rsk":
      return 30;
    case "arbitrum":
    case "arb":
      return 42161;
    case "fantom":
    case "ftm":
      return 250;
    case "harmony":
    case "one":
      return 1666600000;
    case "cronos":
    case "cro":
      return 25;
    case "aurora":
      return 1313161554;
    case "oasis":
    case "oac":
      return 26863;
    case "boba":
      return 288;
    default:
      return -1;
  }
}