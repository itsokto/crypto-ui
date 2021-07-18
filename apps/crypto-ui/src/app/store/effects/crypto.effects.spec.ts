import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CryptoEffects } from './crypto.effects';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CryptoEffects', () => {
  let actions$: Observable<unknown>;
  let effects: CryptoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CryptoEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(CryptoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
