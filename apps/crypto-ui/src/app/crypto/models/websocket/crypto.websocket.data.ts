export interface CryptoWebsocketData<T> {
  id: string;
  d: T;
  s: string;
}

export interface CryptoWebsocketCurrency {
  cr: {
    id: number;
    fmc24hpc: number;
    d: number;
    p1h: number;
    p24h: number;
    p7d: number;
    p30d?: number;
    p: number;
  };
  t: number;
}
