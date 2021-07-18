import * as fromCrypto from './crypto.actions';
import { ECryptoActions } from './crypto.actions';

describe('loadCryptos', () => {
  it('should return an action', () => {
    expect(fromCrypto.loadCryptos({}).type).toBe(ECryptoActions.LoadCryptos);
  });
});
