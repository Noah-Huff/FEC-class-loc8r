import { Component, OnInit } from '@angular/core';
import { Loc8rDataService } from '../loc8r-data.service';
import { GeolocationService } from '../geolocation.service';
import { Location } from '../location';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit {

  constructor(private loc8rDataService: Loc8rDataService,
    private geolocationsService: GeolocationService) { }

  public locations: Location[];
  public message: string;

  private _getLocations(position: any): void {
    this.message = 'Searching for nearby places';
    const lat: number = position.coords.latitude;
    const lng: number = position.coords.longitude;
    //this.locations[this.locations.length-1].coords[0] = lat;
    //this.locations[this.locations.length-1].coords[1] = lat;
    this.loc8rDataService
    .getLocations(lat, lng)
    .then(foundLocations => 
      { this.message = foundLocations.length > 0 ? '' : 'No locations found'; 
      this.locations = foundLocations;
  });
  }

  private _showError(error: any): void {
    this.message = error.message;
  };

  private _noGeo(): void {
    this.message = 'Geolocation not supported by this browser.';
  };

  private _getPosition(): void {
    this.message = 'Getting your location...';
    this.geolocationsService.getPosition(
      this._getLocations.bind(this),
      this._showError.bind(this),
      this._noGeo.bind(this));
  }

  ngOnInit() {
    this._getPosition();
  }
}
