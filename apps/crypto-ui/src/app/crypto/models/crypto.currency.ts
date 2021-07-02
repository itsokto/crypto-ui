import { CryptoPlatform } from './crypto.listing';

export interface CryptoCurrency {
  id: number;
  name: string;
  sign: string;
  symbol: string;
}

export interface CryptoCurrencyMap {
  id: number;
  rank: number;
  name: string;
  symbol: string;
  slug: string;
  is_active: number;
  first_historical_data: Date;
  last_historical_data: Date;
  platform?: CryptoPlatform;
}
