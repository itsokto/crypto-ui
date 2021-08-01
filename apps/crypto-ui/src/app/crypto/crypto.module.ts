import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { CryptoEffects } from './store/effects/crypto.effects';
import { CryptoApiService, CryptoDataService, CryptoWebsocketService, CryptoIconRegistryService } from './services';
import { CRYPTO_MODULE_CONFIG, CryptoModuleConfig } from './models/crypto-module.config';

export class CryptoConfig {
  apiKey: string | undefined;
}

@NgModule({
  imports: [CommonModule, EffectsModule.forFeature([CryptoEffects])],
  providers: [CryptoApiService, CryptoWebsocketService, CryptoDataService, CryptoIconRegistryService],
})
export class CryptoModule {
  static forRoot(config: CryptoModuleConfig): ModuleWithProviders<CryptoModule> {
    return {
      ngModule: CryptoModule,
      providers: [{ provide: CRYPTO_MODULE_CONFIG, useValue: config }],
    };
  }
}
