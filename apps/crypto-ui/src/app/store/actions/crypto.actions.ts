import { createAction, props } from '@ngrx/store';
import { CryptoListing } from '../../crypto/models/crypto.listing';
import { Update } from '@ngrx/entity';

export enum ECryptoActions {
  LoadCryptos = '[Crypto] Load Cryptos',
  LoadCryptosSuccess = '[Crypto] Load Cryptos Success',
  LoadCryptosFailure = '[Crypto] Load Cryptos Failure',
  UpdateCrypto = '[Crypto] Update Crypto',
}

export const loadCryptos = createAction(ECryptoActions.LoadCryptos, props<{ params?: { convert?: string } }>());

export const loadCryptosSuccess = createAction(ECryptoActions.LoadCryptosSuccess, props<{ data: CryptoListing[] }>());

export const loadCryptosFailure = createAction(ECryptoActions.LoadCryptosFailure, props<{ error: any }>());

export const updateCrypto = createAction(ECryptoActions.UpdateCrypto, props<Update<CryptoListing>>());
