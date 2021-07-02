import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CryptoCurrency } from '../../../crypto/models/crypto.currency';

export interface CurrencyModalData {
  currencies: CryptoCurrency[];
  selectedCurrency: CryptoCurrency;
}

@Component({
  selector: 'crypto-ui-workspace-currency-modal',
  templateUrl: './currency-modal.component.html',
  styleUrls: ['./currency-modal.component.scss'],
})
export class CurrencyModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CurrencyModalData) {}

  ngOnInit(): void {}
}
