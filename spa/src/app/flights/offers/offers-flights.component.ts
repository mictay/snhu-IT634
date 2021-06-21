import { Component, OnInit } from '@angular/core';
import { Airport } from '../../core/interfaces/airport';
import { WeatherRequest, WeatherResponse, WeatherData, WeatherMain } from '../../core/interfaces/weather';
import { AirportService } from '../../core/service/airport.service';
import { SessionService } from '../../core/service/session.service';
import { FlightsService } from '../../core/service/flights.service';
import { WeatherService } from '../../core/service/weather.service';
import { FormControl } from '@angular/forms';
import { Flight, FlightsRequest, FlightsResponse } from "../../core/interfaces/flights";
import { Router } from "@angular/router";

@Component({
  selector: 'app-offers-flights',
  templateUrl: './offers-flights.component.html',
  styleUrls: ['./offers-flights.component.scss'],
})
export class OffersFlightsComponent implements OnInit {
  displayedColumns: string[] = ['flight', 'departing', 'departs', 'arrives', 'price'];

  processing:boolean = false;
  hasError:boolean = false;
  errorMessage:string = '';
  flightResponse:FlightsResponse;
  flightRequest:FlightsRequest;

  airportDeparting:Airport;
  airportArriving:Airport;

  lblDepartingDisplayName: string;
  lblArrivingDisplayName: string;
  lblDepartingLat: string;
  lblDepartingLon: string;
  lblArrivingLat: string;
  lblArrivingLon: string;

  adults:number;
  children:number;
  distance:string;
  duration:string;

  dataSource:any = [
    { flight: 'no flight data'},
  ];

  /*****************************************************************************
   */
  constructor(private airportService: AirportService, 
    private flightsService: FlightsService,
    private sessionService: SessionService, 
    private weatherService: WeatherService,
    private router:Router) {
    console.log("OffersFlightsComponent:constructor", "called");

    // Get the Params from the Session (put there by the search-flights-components.ts)
    this.flightRequest = this.sessionService.getFlightsRequest();
    this.airportDeparting = this.flightRequest ? this.flightRequest.from : null;
    this.airportArriving = this.flightRequest ? this.flightRequest.to : null;
    console.log('OffersFlightsComponent:constructor flightRequest', this.flightRequest);    
  }

  /*****************************************************************************
   */
  ngOnInit() {    
    console.log("OffersFlightsComponent:ngOnInit", "called");
    this.hasError = false;
    this.processing = true;

    this.searchFlights();
  }

  /*****************************************************************************
   * Filter the airports list and send back to populate the selected Airports
   */
  searchFlights() {

    // Validate we have a proper flight request object
    if(!this.flightRequest || (this.flightRequest.adults + this.flightRequest.children) === 0) {
      this.errorMessage = "Not a valid request.  Return to the Search Screen";
      this.hasError = true;
      return;
    }

    // Update our Depart and Arriving Airport Information
    this.lblDepartingDisplayName = this.flightRequest.from.displayName;
    this.lblArrivingDisplayName = this.flightRequest.to.displayName;

    this.lblDepartingLat = this.flightRequest.from.lat + "";
    this.lblArrivingLat = this.flightRequest.to.lat + "";

    this.lblDepartingLon = this.flightRequest.from.lon + "";
    this.lblArrivingLon = this.flightRequest.to.lon + "";

    this.children = this.flightRequest.children;
    this.adults = this.flightRequest.adults;
    this.distance = '';

    // We have enought information to populate the Weather Information
    //this.updateWeather(this.flightRequest.from.lat, this.flightRequest.from.lon, 'Departing');
    //this.updateWeather(this.flightRequest.to.lat, this.flightRequest.to.lon, 'Arriving');

    // Call the Flights Service to get all Flight Information
    this.flightsService.getFlights(this.flightRequest).subscribe( 
      (data:FlightsResponse) => {
        console.log('OffersFlightsComponent:searchFlights data', data);

        //Stop if our service validation says we have an error
        if(data['error']) {
          this.errorMessage = '[Message from the API]' + data['error'];
          this.hasError = true;
          return;
        }

        if (!data['flights'] || !data["flights"]['flightDeparture'] || data["flights"]['flightDeparture'].lenght === 0) {
          this.errorMessage = "Flights not found. Please try a different search";
          this.hasError = true;
        }

        //We have a response, lets map it to our datasource
        //{ flight: 1014, departs: '10:52a', arrives: '10:52a', price: '$99.99'}
        this.dataSource = [];
        var i = 0;
        const interateData:Flight[] = data['flights']['flightDeparture'];

        for(let flight of interateData) {
          console.log("flight", flight);

          if(i === 0) {
            this.distance = flight.distance.toFixed(2) + ' miles';
            this.duration = flight.duration.toFixed(2) + ' hrs';
          }

          var departs = new Date(flight.departs);
          var arrives = new Date(flight.arrives);

          this.dataSource.push(
            {
              "flight": flight.flight,
              "departing": this.sessionService.formatDateMMDDYYY(departs),
              "departs": this.sessionService.toTime(departs),
              "arrives": this.sessionService.toTime(arrives),
              "price": '$' + (flight.total).toFixed(2),
            }
          );

        }

        this.hasError = false;
        this.processing = false;
        console.log('OffersFlightsComponent:searchFlights completed');
      },
      (error:string) => {
        console.log('OffersFlightsComponent:searchFlights error', error)
    });

  }

}//end class
