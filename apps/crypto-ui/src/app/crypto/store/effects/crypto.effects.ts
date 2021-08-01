import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadCryptos, loadCryptosFailure, loadCryptosSuccess } from '../actions/crypto.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CryptoApiService } from '../../services';
import { CryptoModel } from '../models/crypto.model';

@Injectable()
export class CryptoEffects {
  constructor(private actions$: Actions, private _cryptoApi: CryptoApiService) {}

  loadCryptos = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCryptos),
      switchMap(({ params }) =>
        this._cryptoApi.getListingLatest(params?.convert?.symbol).pipe(
          map((response) =>
            response.data?.map((listing) => {
              const currency = params?.convert?.symbol ?? 'USD';
              return <CryptoModel>{
                id: listing.id,
                name: listing.name,
                sign: params?.convert?.sign ?? '$',
                symbol: listing.symbol,
                price: listing.quote[currency].price,
                percent_change_1h: listing.quote[currency].percent_change_1h,
                percent_change_24h: listing.quote[currency].percent_change_24h,
                percent_change_7d: listing.quote[currency].percent_change_7d,
                percent_change_30d: listing.quote[currency].percent_change_30d,
              };
            })
          ),
          map((data) => loadCryptosSuccess({ data: data ?? [] })),
          catchError((error) => of(loadCryptosFailure({ error })))
        )
      )
    )
  );
}
