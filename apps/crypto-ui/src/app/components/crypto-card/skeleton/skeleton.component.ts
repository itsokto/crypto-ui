import { Component } from '@angular/core';
import { NgxSkeletonLoaderConfigTheme } from 'ngx-skeleton-loader/lib/ngx-skeleton-loader-config.types';

@Component({
  selector: 'cu-crypto-card-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent {
  priceTheme: NgxSkeletonLoaderConfigTheme = {
    width: '150px',
    height: '1.1rem',
    'margin-bottom': '0',
    background: 'rgba(255, 255, 255, 0.3)',
  };

  labelTheme: NgxSkeletonLoaderConfigTheme = {
    width: '120px',
    height: '1.1rem',
    'margin-bottom': '0',
    background: 'rgba(255, 255, 255, 0.3)',
  };

  iconTheme: NgxSkeletonLoaderConfigTheme = {
    width: '2rem',
    height: '2rem',
    margin: '0',
    'margin-right': '0.5rem',
    background: 'rgba(255, 255, 255, 0.3)',
  };
}
