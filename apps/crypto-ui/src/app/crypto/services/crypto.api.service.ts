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
    const params: { convert?: string } = { convert };

    return this.getInternal<CryptoResponse<CryptoListing[]>>('api/cryptocurrency/listings/latest', { params });
  }

  getFiatMap(): Observable<CryptoResponse<CryptoCurrency[]>> {
    return this.getInternal<CryptoResponse<CryptoCurrency[]>>('api/fiat/map');
  }

  getCurrencyMap(): Observable<CryptoResponse<CryptoCurrencyMap[]>> {
    return this.getInternal<CryptoResponse<CryptoCurrencyMap[]>>('api/cryptocurrency/map');
  }

  getCurrencyQuotesLatest(ids: number[]): Observable<CryptoResponse<Record<string, CryptoListing>>> {
    return this.getInternal<CryptoResponse<Record<string, CryptoListing>>>('api/cryptocurrency/quotes/latest', {
      params: { id: ids.join() },
    });
  }

  private getInternal<T>(
    url: string,
    options: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body';
      responseType?: 'json';
      params?:
        | HttpParams
        | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
          };
    } = {}
  ): Observable<T> {
    options.headers ??= {};
    if (options.headers instanceof HttpHeaders) {
      options.headers.append('X-CMC_PRO_API_KEY', this._apiKey ?? '');
    } else {
      (options.headers as Record<string, string>)['X-CMC_PRO_API_KEY'] = this._apiKey ?? '';
    }

    return this._httpClient.get<T>(url, options);
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
