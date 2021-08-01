import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoListComponent } from './crypto-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CryptoApiService, CryptoDataService, CryptoWebsocketService } from '../../crypto/services';
import { provideMockStore } from '@ngrx/store/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

describe('CryptoListComponent', () => {
  let component: CryptoListComponent;
  let fixture: ComponentFixture<CryptoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, MatIconModule],
      declarations: [CryptoListComponent],
      providers: [CryptoWebsocketService, CryptoDataService, CryptoApiService, provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
