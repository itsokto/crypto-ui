import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CryptoCardData } from '../../components/crypto-card/models/crypto-card-data';
import { CryptoCurrency } from '../../crypto/models/crypto.currency';

export enum ECryptoActions {
  LoadCryptos = '[Crypto] Load Cryptos',
  LoadCryptosSuccess = '[Crypto] Load Cryptos Success',
  LoadCryptosFailure = '[Crypto] Load Cryptos Failure',
  UpdateCrypto = '[Crypto] Update Crypto',
}

export const loadCryptos = createAction(ECryptoActions.LoadCryptos, props<{ params?: { convert?: CryptoCurrency } }>());

export const loadCryptosSuccess = createAction(ECryptoActions.LoadCryptosSuccess, props<{ data: CryptoCardData[] }>());

export const loadCryptosFailure = createAction(ECryptoActions.LoadCryptosFailure, props<{ error: any }>());

export const updateCrypto = createAction(ECryptoActions.UpdateCrypto, props<Update<CryptoCardData>>());
