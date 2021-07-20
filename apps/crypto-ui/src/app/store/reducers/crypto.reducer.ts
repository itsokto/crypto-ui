import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { loadCryptos, loadCryptosSuccess, updateCrypto } from '../actions/crypto.actions';
import { CryptoCardData } from '../../components/crypto-card/models/crypto-card-data';

export const cryptoFeatureKey = 'crypto';

export interface ICryptoState extends EntityState<CryptoCardData> {
  loading: boolean;
}

export const cryptoAdapter = createEntityAdapter<CryptoCardData>();
export const cryptoInitialState: ICryptoState = cryptoAdapter.getInitialState({ loading: false });

export const cryptoReducer = createReducer(
  cryptoInitialState,
  on(loadCryptos, (state) => {
    return { ...state, loading: true };
  }),
  on(loadCryptosSuccess, (state, { data }) => cryptoAdapter.setAll(data, { ...state, loading: false })),
  on(updateCrypto, (state, data) => cryptoAdapter.updateOne(data, state))
);
