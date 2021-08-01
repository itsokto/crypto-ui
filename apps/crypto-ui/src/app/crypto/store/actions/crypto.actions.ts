import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CryptoModel } from '../models/crypto.model';
import { CryptoCurrency } from '../../models/crypto.currency';

export enum ECryptoActions {
  LoadCryptos = '[Crypto] Load Cryptos',
  LoadCryptosSuccess = '[Crypto] Load Cryptos Success',
  LoadCryptosFailure = '[Crypto] Load Cryptos Failure',
  UpdateCrypto = '[Crypto] Update Crypto',
  UpdateCryptos = '[Crypto] Update Cryptos',
}

export const loadCryptos = createAction(ECryptoActions.LoadCryptos, props<{ params?: { convert?: CryptoCurrency } }>());

export const loadCryptosSuccess = createAction(ECryptoActions.LoadCryptosSuccess, props<{ data: CryptoModel[] }>());

export const loadCryptosFailure = createAction(ECryptoActions.LoadCryptosFailure, props<{ error: unknown }>());

export const updateCrypto = createAction(ECryptoActions.UpdateCrypto, props<Update<CryptoModel>>());

export const updateCryptos = createAction(ECryptoActions.UpdateCryptos, props<{ updates: Update<CryptoModel>[] }>());
