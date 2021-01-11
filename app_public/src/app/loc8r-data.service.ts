import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getLocaleCurrencyName } from '@angular/common';
import { Location, Review } from './location';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {

  constructor(private http: HttpClient) { }

  private apiBaseUrl = environment.apiBaseUrl;

  public getLocations(lat: number, lng: number): Promise<Location[]> {
    const maxDistance: number = 20000;
    const url: string = `${this.apiBaseUrl}/locations?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`;
    
    return this.http
    .get(url)
    .toPromise()
    .then(response => response as Location[])
    .catch(this._handleError);
  }
  public getLocationById(locationId: string): Promise<Location> {
    const url: string = `${this.apiBaseUrl}/locations/${locationId}`;
    return this.http
    .get(url)
    .toPromise()
    .then(response => response as Location)
    .catch(this._handleError);
  }
  public addReviewByLocationId(locationId: string, formData: Review): Promise<Review> {
    const url: string =`${this.apiBaseUrl}/locations/${locationId}/reviews`;
    return this.http
    .post(url, formData)
    .toPromise()
    .then(response => response as Review)
    .catch(this._handleError);
  }
  private _handleError(error: any): Promise<any> {
    /*if (error instanceof Error) {
      console.error('An error occurred', error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }*/
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }
}

