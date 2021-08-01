import { cryptoReducer, cryptoInitialState } from './crypto.reducer';

describe('Crypto Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as never;

      const result = cryptoReducer(cryptoInitialState, action);

      expect(result).toBe(cryptoInitialState);
    });
  });
});
