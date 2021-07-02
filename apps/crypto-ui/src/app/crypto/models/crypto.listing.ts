export interface CryptoListing {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: Date;
  tags: string[];
  max_supply: number;
  circulating_supply: number;
  total_supply: number;
  platform?: CryptoPlatform;
  cmc_rank?: number;
  last_updated: Date;
  quote: Record<string, CryptoQuote>;
}

export interface CryptoPlatform {
  id?: number;
  name?: string;
  symbol?: string;
  slug?: string;
  token_address?: string;
}

export interface CryptoQuote {
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  market_cap: number;
  last_updated: Date;
}
