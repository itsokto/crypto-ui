import { Component, Input } from '@angular/core';
import { CryptoIconRegistryService } from '../../crypto/services';
import { priceUpdate } from '../../common/animations';
import { CryptoCardData } from './models/crypto-card-data';

@Component({
  selector: 'cu-crypto-card',
  templateUrl: './crypto-card.component.html',
  styleUrls: ['./crypto-card.component.scss'],
  animations: [priceUpdate],
})
export class CryptoCardComponent {
  constructor(public readonly cryptoIconRegistry: CryptoIconRegistryService) {}

  @Input() data!: CryptoCardData;
}
