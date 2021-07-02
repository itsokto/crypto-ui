import { cryptoAdapter, cryptoFeatureKey, ICryptoState } from '../reducers/crypto.reducer';
import { createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../index';

export const selectCryptoState = createFeatureSelector<IAppState, ICryptoState>(cryptoFeatureKey);
export const cryptoSelectors = cryptoAdapter.getSelectors(selectCryptoState);
