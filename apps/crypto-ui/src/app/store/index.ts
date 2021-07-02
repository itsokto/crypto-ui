import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { cryptoReducer, ICryptoState } from './reducers/crypto.reducer';

export interface IAppState {
  crypto: ICryptoState;
}

export const reducers: ActionReducerMap<IAppState> = {
  crypto: cryptoReducer,
};

export const metaReducers: MetaReducer<IAppState>[] = !environment.production ? [] : [];
