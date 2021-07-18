import { Component, Input } from '@angular/core';
import { CryptoIconRegistryService } from '../../crypto/services/crypto.icon.registry.service';
import { priceUpdate } from '../../common/animations';

@Component({
  selector: 'cu-crypto-card',
  templateUrl: './crypto-card.component.html',
  styleUrls: ['./crypto-card.component.scss'],
  animations: [priceUpdate],
})
export class CryptoCardComponent {
  constructor(public readonly cryptoIconRegistry: CryptoIconRegistryService) {}

  @Input() sign: string | undefined;
  @Input() symbol: string | undefined;
  @Input() name: string | undefined;
  @Input() price: number | undefined;
  @Input() percent_change_1h: number | undefined;
  @Input() percent_change_24h: number | undefined;
  @Input() percent_change_7d: number | undefined;
  @Input() percent_change_30d: number | undefined;
}
