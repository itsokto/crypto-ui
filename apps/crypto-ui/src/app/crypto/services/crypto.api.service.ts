import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CryptoResponse } from '../models/crypto.response';
import { CryptoListing } from '../models/crypto.listing';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { CryptoCurrency, CryptoCurrencyMap } from '../models/crypto.currency';

@Injectable({
  providedIn: 'root',
})
export class CryptoApiService {
  private _apiKey: string | undefined;
  private _webSocket: WebSocketSubject<unknown> | undefined;

  constructor(private _httpClient: HttpClient) {}

  setApiKey(key: string): void {
    this._apiKey = key;
  }

  getListingLatest(convert?: string): Observable<CryptoResponse<CryptoListing[]>> {
    const params: { convert?: string } = { convert: convert };

    const options: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body';
      responseType?: 'json';
      params: HttpParams;
    } = {
      headers: {
        'X-CMC_PRO_API_KEY': this._apiKey ?? '',
      },
      params: new HttpParams({ fromObject: params }),
    };

    return this._httpClient.get<CryptoResponse<CryptoListing[]>>('api/cryptocurrency/listings/latest', options);
  }

  getFiatMap(): Observable<CryptoResponse<CryptoCurrency[]>> {
    const options: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body';
      responseType?: 'json';
    } = {
      headers: {
        'X-CMC_PRO_API_KEY': this._apiKey ?? '',
      },
    };

    return this._httpClient.get<CryptoResponse<CryptoCurrency[]>>('api/fiat/map', options);
  }

  getCurrencyMap(): Observable<CryptoResponse<CryptoCurrencyMap[]>> {
    const options: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body';
      responseType?: 'json';
    } = {
      headers: {
        'X-CMC_PRO_API_KEY': this._apiKey ?? '',
      },
    };

    return this._httpClient.get<CryptoResponse<CryptoCurrencyMap[]>>('api/cryptocurrency/map', options);
  }

  getCurrencyQuotesLatest(ids: number[]): Observable<CryptoResponse<Record<string, CryptoListing>>> {
    const options: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body';
      responseType?: 'json';
      params: HttpParams;
    } = {
      headers: {
        'X-CMC_PRO_API_KEY': this._apiKey ?? '',
      },
      params: new HttpParams({ fromObject: { id: ids.join() } }),
    };

    return this._httpClient.get<CryptoResponse<Record<string, CryptoListing>>>(
      'api/cryptocurrency/quotes/latest',
      options
    );
  }

  connect(cryptoIds: number[]): WebSocketSubject<unknown> {
    if (this._webSocket) {
      return this._webSocket;
    }

    const subject = webSocket('wss://stream.coinmarketcap.com/price/latest');
    const message = {
      method: 'subscribe',
      id: 'price',
      data: {
        cryptoIds,
      },
    };

    subject.next(message);

    return subject;
  }
}
