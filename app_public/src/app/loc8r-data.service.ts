import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor } from '@angular/common/http';
import { getLocaleCurrencyName } from '@angular/common';
import { Location, Review } from './location';
import { environment } from '../environments/environment';
import { AuthResponse } from './authresponse';
import { BROWSER_STORAGE } from './storage';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) { }

  private apiBaseUrl = environment.apiBaseUrl;

  public getLocations(lat: number, lng: number): Promise<Location[]> {
    const maxDistance: number = 40000;
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
    console.log('THIS IS THE HTTPHEADER', `${this.storage.getItem('loc8r-token')}`);
    const url: string =`${this.apiBaseUrl}/locations/${locationId}/reviews`;
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('loc8r-token')}`
      })
    };
    return this.http
    .post(url, formData, httpOptions)
    .toPromise()
    .then(response => response as Review)
    .catch(this._handleError);
  }

  public login(user: User): Promise<AuthResponse> {
    return this._makeAuthApiCall('login', user);
  }

  public register(user: User): Promise<AuthResponse> {
    return this._makeAuthApiCall('register', user);
  }
  
  private _makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
    .post(url, user)
    .toPromise()
    .then(response => response as AuthResponse)
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

