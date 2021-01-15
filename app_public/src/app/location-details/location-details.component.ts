import { Component, OnInit, Input } from '@angular/core';
import { Location, Review } from '../location';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Loc8rDataService } from '../loc8r-data.service';
import { switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';


import * as L from 'leaflet';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {

  @Input() location: Location;

  newLocation: Location;

  constructor(private loc8rDataService: Loc8rDataService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
    ) { }

  ngOnInit() {
    /*
    this.route.paramMap
    .pipe(
      switchMap((params: ParamMap) => {
        let id = params.get('locationid');
        console.log('ID', id);
        return this.loc8rDataService.getLocationById(id);
      })
    )
    .subscribe((newLocation: Location) => {
      this.newLocation = newLocation;
      let lat = newLocation.coords[0];
      console.log('LOCATOIN_DETAILS_LAT', lat);
    });


    console.log('LOCATION-DETAILS', location);
*/

var lat = this.location.coords.coordinates[1];
var lng = this.location.coords.coordinates[0];

var mymap = L.map('mapid').setView([lat, lng], 13);

L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaHVmZnN0ZXIiLCJhIjoiY2toZTZzeTd4MG03czMwbzIwN2xiNHgwaSJ9.4PrmZNzpL6Q1rZ49bCD9lA'
}).addTo(mymap);
  }

  public newReview: Review = {
    author: '',
    rating: 5,
    reviewText: ''
  };
  
  public formVisible: boolean = false;

  public onReviewSubmit(): void {
    this.formError = '';
    this.newReview.author = this.getUsername();
    if (this._formIsValid()) {
      console.log(this.newReview);
      this.loc8rDataService.addReviewByLocationId(this.location._id, this.newReview)
      .then((review: Review) => {
        console.log('Review Saved', review);
        let reviews = this.location.reviews.slice(0);
        reviews.unshift(review);
        this.location.reviews = reviews;
        this._resetAndHideReviewForm();
      });
    } else {
      this.formError = 'All fields required, please try again';
    }
  }
  
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public getUsername(): string {
    const { name } = this.authenticationService.getCurrentUser();
    return name ? name : 'Guest';
  }

  public formError: string;

  private _formIsValid(): boolean {
    if (this.newReview.author && this.newReview.rating && this.newReview.reviewText) {
      return true;
    } else {
      return false;
    }
  }

  private _resetAndHideReviewForm(): void {
    this.formVisible = false;
    this.newReview.author = '';
    this.newReview.rating = 5;
    this.newReview.reviewText = '';
  }

}
