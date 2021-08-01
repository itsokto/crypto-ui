import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CryptoEffects } from './crypto.effects';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CryptoModule } from '../../crypto.module';
import { EffectsModule } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';

describe('CryptoEffects', () => {
  let actions$: Observable<unknown>;
  let effects: CryptoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CryptoModule, EffectsModule.forRoot()],
      providers: [CryptoEffects, provideMockActions(() => actions$), provideMockStore()],
    });

    effects = TestBed.inject(CryptoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
