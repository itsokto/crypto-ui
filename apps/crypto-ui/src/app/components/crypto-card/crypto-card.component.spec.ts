import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoCardComponent } from './crypto-card.component';
import { MatIconModule } from '@angular/material/icon';
import { PricelowhighPipe } from '../../common/pipes/pricelowhigh.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CryptoCardComponent', () => {
  let component: CryptoCardComponent;
  let fixture: ComponentFixture<CryptoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, NoopAnimationsModule],
      declarations: [CryptoCardComponent, PricelowhighPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
