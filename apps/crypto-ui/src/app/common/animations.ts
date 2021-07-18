import { animate, state, style, transition, trigger } from '@angular/animations';

export const priceUpdate = trigger('priceUpdate', [
  transition(':increment, :decrement', [animate('0.1s', style({ color: 'white' })), animate('1s', style({}))]),
]);

export const appLoaded = trigger('shrink', [
  state('false', style({})),
  state('true', style({ height: '20rem' })),
  transition('false => true', [animate('1s cubic-bezier(0.16, 1, 0.3, 1)')]),
]);
