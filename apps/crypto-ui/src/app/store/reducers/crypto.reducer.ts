import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { loadCryptosSuccess, updateCrypto } from '../actions/crypto.actions';
import { CryptoCardData } from '../../components/crypto-card/models/crypto-card-data';

export const cryptoFeatureKey = 'crypto';

export type ICryptoState = EntityState<CryptoCardData>;

export const cryptoAdapter = createEntityAdapter<CryptoCardData>();
export const cryptoInitialState: ICryptoState = cryptoAdapter.getInitialState();

export const cryptoReducer = createReducer(
  cryptoInitialState,
  on(loadCryptosSuccess, (state, { data }) => cryptoAdapter.setAll(data, state)),
  on(updateCrypto, (state, data) => cryptoAdapter.updateOne(data, state))
);
