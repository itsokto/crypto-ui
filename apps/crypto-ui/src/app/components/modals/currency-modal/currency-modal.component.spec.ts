import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyModalComponent, CurrencyModalData } from './currency-modal.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

describe('CurrencyModalComponent', () => {
  let component: CurrencyModalComponent;
  let fixture: ComponentFixture<CurrencyModalComponent>;
  const mockData: CurrencyModalData = {
    currencies: [],
    selectedCurrency: { id: 0, sign: '', name: '', symbol: '' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [CurrencyModalComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
