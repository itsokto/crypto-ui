import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricelowhigh',
})
export class PricelowhighPipe implements PipeTransform {
  transform(value?: number): unknown {
    return value ? value < 0 : false;
  }
}
