import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CryptoCurrency } from '../../../crypto/models/crypto.currency';

export interface CurrencyModalData {
  currencies: CryptoCurrency[];
  selectedCurrency: CryptoCurrency;
}

@Component({
  selector: 'cu-currency-modal',
  templateUrl: './currency-modal.component.html',
  styleUrls: ['./currency-modal.component.scss'],
})
export class CurrencyModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CurrencyModalData) {}
}
