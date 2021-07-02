export interface CryptoStatus {
  timestamp?: Date;
  error_code?: number;
  error_message?: string;
  elapsed?: number;
  credit_count?: number;
  notice?: string;
  total_count?: number;
}
