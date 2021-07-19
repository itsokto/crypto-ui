import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoCardComponent } from './crypto-card.component';
import { MatIconModule } from '@angular/material/icon';
import { PricelowhighPipe } from '../../common/pipes/pricelowhigh.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CryptoCardData } from './models/crypto-card-data';

describe('CryptoCardComponent', () => {
  let component: CryptoCardComponent;
  let fixture: ComponentFixture<CryptoCardComponent>;
  let nativeElement: HTMLElement;
  const mockData: CryptoCardData = {
    id: 0,
    sign: '$',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 30000,
    percent_change_1h: -0.234,
    percent_change_24h: 5.3242,
    percent_change_7d: 2.345,
    percent_change_30d: 10.3452,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatIconModule, NoopAnimationsModule],
      declarations: [CryptoCardComponent, PricelowhighPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoCardComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;

    fixture.componentInstance.data = mockData;
    component.cryptoIconRegistry.registerIcons();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const element = nativeElement.querySelector('.crypto-card__title');

    expect(element?.textContent).toContain('Bitcoin BTC');
  });

  it('should render price', () => {
    const element = nativeElement.querySelector('.crypto-card__price');

    expect(element?.textContent).toContain('$ 30,000.0');
  });

  it('should render 1h low percent price', () => {
    const element = nativeElement.querySelector('.js-crypto-card__percent-price-1h');

    expect(element?.textContent).toContain('-0.234');
    expect(element?.classList).toContain('crypto-card__percent-price_low');
  });

  it('should render 24h percent price', () => {
    const element = nativeElement.querySelector('.js-crypto-card__percent-price-24h');

    expect(element?.textContent).toContain('5.3242');
  });

  it('should render 7d percent price', () => {
    const element = nativeElement.querySelector('.js-crypto-card__percent-price-7d');

    expect(element?.textContent).toContain('2.345');
  });

  it('should render 30d percent price', () => {
    const element = nativeElement.querySelector('.js-crypto-card__percent-price-30d');

    expect(element?.textContent).toContain('10.3452');
  });
});
