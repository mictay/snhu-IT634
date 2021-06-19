import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/overlay-directives';
import { Component, OnInit } from '@angular/core';
import { Airport } from '../../core/interfaces/airport';
import { AirportService } from '../../core/service/airport.service';
import { SessionService } from '../../core/service/session.service';
import { FormControl } from '@angular/forms';
import { FlightsRequest } from "../../core/interfaces/flights";
import { Router } from "@angular/router";

@Component({
  selector: 'app-search-flights',
  templateUrl: './search-flights.component.html',
  styleUrls: ['./search-flights.component.scss'],
})
export class SearchFlightsComponent implements OnInit {
  airportsFrom: Airport[] = [];
  airportsTo: Airport[] = [];
  roundTripSelection: string = 'true';
  children: number = 0;
  adults: number = 0;

  // Initially fill the selectedAirport so it can be used in the for loop
  selectedAirportFrom: Airport = null;
  selectedAirportTo: Airport = null;
  departureDate = new FormControl(new Date()); //today
  now = new Date();
  returnDate = new FormControl(this.addDays(this.now, 7)); //next week
  disableButton = true;

  /*****************************************************************************
   */
  constructor(private airportService: AirportService, private sessionService:SessionService, private router:Router) {}

  /*****************************************************************************
   */
  ngOnInit() {
    this.roundTripSelection = 'true';
  }

  /*****************************************************************************
   * Receive user input and send to search method
   * @param value
   */
  onKeyFrom(value) {
    if (this.search(value))
      this.search(value)
        .then((data: Airport[]) => {
          console.log('onKeyFrom', data);
          this.airportsFrom = data;
        })
        .catch((err) => {
          console.log(err);
        });
  }

  /*****************************************************************************
   * Receive user input and send to search method
   */
  onKeyTo(value) {
    if (this.search(value))
      this.search(value)
        .then((data: Airport[]) => {
          this.airportsTo = data;
        })
        .catch((err) => {
          console.log(err);
        });
  }

  /*****************************************************************************
   * Filter the airports list and send back to populate the selected Airports
   */
  search(value: string): Promise<any> {
    return new Promise<Airport[]>((resolve, reject) => {
      let filter = value.toLowerCase();
      this.airportService.getAirports(value).subscribe((data) => {
        //console.log(data);

        let ret: Airport[] = [];

        if (data && data.airports) ret = data.airports;
        resolve(ret);
      });
    });

    //return [];
    //return this.airportService.getAirports(value);
    //return this.allAirports.filter(option => option.name.toLowerCase().includes(filter));
  }

  /*****************************************************************************
   */
  onChange(event) {
    console.log('onChange', event);

    let enableButton = true;

    if ( (this.adults + this.children) === 0){
      console.log("Party Count", (this.adults + this.children));
      enableButton = false;
    }

    if (this.selectedAirportFrom === null){
      console.log("selectedAirportFrom", this.selectedAirportFrom);
      enableButton = false;
    }

    if (this.selectedAirportTo === null){
      console.log("selectedAirportTo", this.selectedAirportTo);
      enableButton = false;
    }

    if (this.departureDate === null){
      console.log("departureDate", this.departureDate);
      enableButton = false;
    }

    if (this.returnDate === null){
      console.log("returnDate", this.returnDate);
      enableButton = false;
    }

    if(enableButton)
      this.disableButton = false;

  }

  /*****************************************************************************
   *
   */
  roundTrip($event) {
    console.log($event);
    console.log((this.roundTripSelection = $event.value));
  }

  /*****************************************************************************
   * Assumption, the UI won't let you get here unless everything has been
   * validated.
   */
  onSearch() {
    console.log('selectedAirportFrom', this.selectedAirportFrom);
    console.log('selectedAirportTo', this.selectedAirportTo);
    console.log('roundTripSelection', this.roundTripSelection);
    console.log('adults', this.adults);
    console.log('children', this.children);
    console.log('departureDate', this.departureDate);
    console.log('returnDate', this.returnDate);

    const flightsRequest:FlightsRequest = {
      adults: this.adults,
      children: this.children,
      from: this.selectedAirportFrom,
      to: this.selectedAirportTo,
      dateDeparture: this.departureDate.value,
      dateReturn: this.returnDate.value,
      roundTrip: this.roundTripSelection
    };

    this.sessionService.setFlightRequest(flightsRequest);
    this.router.navigateByUrl('/flights/offers').then( (event)=> {
      console.log("SearchFlightsComponent:navigateByUrl", event);
    }).catch( (err) => {
      console.log("SearchFlightsComponent:navigateByUrl", err);
    });
  }

  /*****************************************************************************
   *
   */
  addDays(date, days) {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  }

  /*****************************************************************************
   *
   */
  updateAdults(event) {
    this.adults = event.val;
    console.log('updateAdults', this.adults);
  }

  /*****************************************************************************
   *
   */
  updateChildren(event) {
    this.children = event.val;
    console.log('updateChildren', this.children);
  }
}
