import { Component, Input, OnInit } from '@angular/core';
import { Location } from '../location';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.css']
})
export class RatingStarsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() rating: number;

}
