import { InjectionToken } from '@angular/core';

export interface CryptoModuleConfig {
  apiKey: string;
}

export const CRYPTO_MODULE_CONFIG = new InjectionToken<CryptoModuleConfig>('crypto-module.config');
