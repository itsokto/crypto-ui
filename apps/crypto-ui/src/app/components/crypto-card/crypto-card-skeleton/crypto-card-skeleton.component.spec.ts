import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoCardSkeletonComponent } from './crypto-card-skeleton.component';

describe('CryptoCardSkeletonComponent', () => {
  let component: CryptoCardSkeletonComponent;
  let fixture: ComponentFixture<CryptoCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoCardSkeletonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
