import { Injectable } from '@angular/core';
import iconManifest from 'cryptocurrency-icons/manifest.json';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const namespace = 'crypto';

@Injectable()
export class CryptoIconRegistryService {
  constructor(private readonly _matIconRegistry: MatIconRegistry, private readonly _sanitizer: DomSanitizer) {
    iconManifest.forEach((icon) => {
      this._matIconRegistry.addSvgIconInNamespace(
        namespace,
        icon.symbol,
        this._sanitizer.bypassSecurityTrustResourceUrl(
          `/assets/cryptocurrency-icons/${icon.symbol.toLocaleLowerCase()}.svg`
        )
      );
    });
  }

  resolveIconWithFallback(name: string): string {
    return `${namespace}:${iconManifest?.find((icon) => icon.symbol === name)?.symbol ?? 'GENERIC'}`;
  }
}
