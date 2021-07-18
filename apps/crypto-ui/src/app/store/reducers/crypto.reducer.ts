import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { CryptoListing } from '../../crypto/models/crypto.listing';
import { loadCryptosSuccess, updateCrypto } from '../actions/crypto.actions';

export const cryptoFeatureKey = 'crypto';

export type ICryptoState = EntityState<CryptoListing>

export const cryptoAdapter: EntityAdapter<CryptoListing> = createEntityAdapter<CryptoListing>();
export const cryptoInitialState: ICryptoState = cryptoAdapter.getInitialState();

export const cryptoReducer = createReducer(
  cryptoInitialState,
  on(loadCryptosSuccess, (state, { data }) => cryptoAdapter.setAll(data, state)),
  on(updateCrypto, (state, data) => cryptoAdapter.updateOne(data, state))
);
