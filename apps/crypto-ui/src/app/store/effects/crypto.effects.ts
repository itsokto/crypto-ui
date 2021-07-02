import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadCryptos, loadCryptosFailure, loadCryptosSuccess } from '../actions/crypto.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CryptoApiService } from '../../crypto/services/crypto.api.service';
import { of } from 'rxjs';

@Injectable()
export class CryptoEffects {
  constructor(private actions$: Actions, private _cryptoApi: CryptoApiService) {}

  loadCryptos = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCryptos),
      switchMap(({ params }) =>
        this._cryptoApi.getListingLatest(params?.convert).pipe(
          map((response) => loadCryptosSuccess({ data: response.data ?? [] })),
          catchError((error) => of(loadCryptosFailure({ error })))
        )
      )
    )
  );
}
