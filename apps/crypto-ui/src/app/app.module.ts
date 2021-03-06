import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CryptoModule } from './crypto/crypto.module';
import { HttpClientModule } from '@angular/common/http';
import { PricelowhighPipe } from './common/pipes/pricelowhigh.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { metaReducers, reducers } from './store';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyModalComponent } from './components/modals/currency-modal/currency-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CryptoCardComponent } from './components/crypto-card/crypto-card.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkeletonComponent } from './components/crypto-card/skeleton/skeleton.component';
import { CryptoListComponent } from './components/crypto-list/crypto-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PricelowhighPipe,
    CurrencyModalComponent,
    CryptoCardComponent,
    SkeletonComponent,
    CryptoListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true,
      },
    }),
    EffectsModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    ScrollingModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    NgxSkeletonLoaderModule.forRoot(),
    CryptoModule.forRoot({ apiKey: '1507c111-13c0-45f2-82a3-4b9308314aa2' }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
