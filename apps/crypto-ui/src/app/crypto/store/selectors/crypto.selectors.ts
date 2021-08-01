import { cryptoAdapter, cryptoFeatureKey, ICryptoState } from '../reducers/crypto.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAppState } from '../../../store';

export const selectCryptoState = createFeatureSelector<IAppState, ICryptoState>(cryptoFeatureKey);

const selectLoading = createSelector(selectCryptoState, (state) => state.loading);
export const cryptoSelectors = { ...cryptoAdapter.getSelectors(selectCryptoState), selectLoading };
