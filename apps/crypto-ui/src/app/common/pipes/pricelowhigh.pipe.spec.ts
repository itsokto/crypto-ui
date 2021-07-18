import { PricelowhighPipe } from './pricelowhigh.pipe';

describe('PricelowhighPipe', () => {
  it('create an instance', () => {
    const pipe = new PricelowhighPipe();
    expect(pipe).toBeTruthy();
  });

  it('should be high price', () => {
    const pipe = new PricelowhighPipe();

    const result = pipe.transform(3000);

    expect(result).toBeFalsy();
  });

  it('should be low price', () => {
    const pipe = new PricelowhighPipe();

    const result = pipe.transform(-3000);

    expect(result).toBeTruthy();
  });
});
