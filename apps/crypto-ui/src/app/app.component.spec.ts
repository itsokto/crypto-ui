import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CryptoApiService, CryptoDataService, CryptoWebsocketService } from './crypto/services';
import { CryptoListComponent } from './components/crypto-list/crypto-list.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, MatIconModule],
      declarations: [AppComponent, CryptoListComponent],
      providers: [provideMockStore(), CryptoDataService, CryptoApiService, CryptoWebsocketService]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
