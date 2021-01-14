import { InjectionToken } from '@angular/core';
import { LocationDetailsComponent } from './location-details/location-details.component';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
    providedIn: 'root',
    factory: () => localStorage
});

export class Storage {
}
