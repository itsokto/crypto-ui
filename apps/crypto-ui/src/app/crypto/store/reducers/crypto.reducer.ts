import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { loadCryptos, loadCryptosSuccess, updateCrypto, updateCryptos } from '../actions/crypto.actions';
import { CryptoModel } from '../models/crypto.model';

export const cryptoFeatureKey = 'crypto';

export interface ICryptoState extends EntityState<CryptoModel> {
  loading: boolean;
}

export const cryptoAdapter = createEntityAdapter<CryptoModel>();
export const cryptoInitialState: ICryptoState = cryptoAdapter.getInitialState({ loading: false });

export const cryptoReducer = createReducer(
  cryptoInitialState,
  on(loadCryptos, (state) => {
    return { ...state, loading: true };
  }),
  on(loadCryptosSuccess, (state, { data }) => cryptoAdapter.setAll(data, { ...state, loading: false })),
  on(updateCrypto, (state, data) => cryptoAdapter.updateOne(data, state)),
  on(updateCryptos, (state, { updates }) => cryptoAdapter.updateMany(updates, state))
);
