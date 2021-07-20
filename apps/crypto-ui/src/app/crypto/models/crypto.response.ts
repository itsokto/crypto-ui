import { CryptoStatus } from './crypto.status';

export interface CryptoResponse<T> {
  status?: CryptoStatus;
  data: T;
}
