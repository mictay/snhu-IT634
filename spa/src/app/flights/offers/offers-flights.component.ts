import { Component, OnInit } from '@angular/core';
import { Airport } from '../../core/interfaces/airport';
import { AirportService } from '../../core/service/airport.service';
import { SessionService } from '../../core/service/session.service';
import { FlightsService } from '../../core/service/flights.service';
import { Flight, FlightsRequest, FlightsResponse } from "../../core/interfaces/flights";
import { Router } from "@angular/router";

@Component({
  selector: 'app-offers-flights',
  templateUrl: './offers-flights.component.html',
  styleUrls: ['./offers-flights.component.scss'],
})
export class OffersFlightsComponent implements OnInit {  

  processing:boolean = false;
  hasError:boolean = false;
  errorMessage:string = '';
  flightResponse:FlightsResponse;
  flightRequest:FlightsRequest;

  airportDeparting:Airport;
  airportArriving:Airport;

  adults:number;
  children:number;
  distance:string;
  duration:string;

  flightDepartureData:Flight[];
  flightReturnData:any;
  isRoundTrip:boolean = false;
  step = 0;
  
  selectedDepartureFlight:Flight = null;
  selectedReturnFlight:Flight = null;
  isBookDisabled:boolean = true;
  isBooked:boolean = false;
  confirmationNumber:string = null;

  /*****************************************************************************
   */
  constructor(private airportService: AirportService, 
    private flightsService: FlightsService,
    private sessionService: SessionService, 
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

    this.selectedDepartureFlight = this.sessionService.getSelectedFlightDeparture();
    this.selectedReturnFlight = this.sessionService.getSelectedFlightReturn();

    if(this.selectedDepartureFlight && this.selectedReturnFlight) {
      this.isBookDisabled = false;
    }

    this.searchFlights();
  }

  /*****************************************************************************
   * Filter the airports list and send back to populate the selected Airports
   */
  searchFlights() {
    console.log("OffersFlightsComponent:searchFlights", "called");

    // Validate we have a proper flight request object
    if(!this.flightRequest || (this.flightRequest.adults + this.flightRequest.children) === 0) {
      this.errorMessage = "Not a valid request.  Return to the Search Screen";
      this.hasError = true;
      return;
    }

    this.children = this.flightRequest.children;
    this.adults = this.flightRequest.adults;
    this.isRoundTrip = this.flightRequest.roundTrip === "true";

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
        this.flightDepartureData = data['flights']['flightDeparture'];

        if(data['flights']['flightReturn'])
          this.flightReturnData = data['flights']['flightReturn'];

        this.hasError = false;
        this.processing = false;
        console.log('OffersFlightsComponent:searchFlights completed');
      },
      (error:string) => {
        console.log('OffersFlightsComponent:searchFlights error', error);
    });

  }

  /*****************************************************************************
   * 
   */
  selectedFlightDeparture(event) {
    console.log("OffersFlightsComponent:selectedFlightDeparture called", event);

    //find the flight number in the flightDepartureData
    for(var i = 0; i < this.flightDepartureData.length; i++) {
      if(this.flightDepartureData[i].flight === event) {
        this.selectedDepartureFlight = this.flightDepartureData[i];
        this.sessionService.setSelectedFlightDeparture(this.selectedDepartureFlight);
        this.nextStep();
        break;
      }
    }

    if(this.selectedDepartureFlight && this.selectedReturnFlight) {
      this.isBookDisabled = false;
    }

    console.log('OffersFlightsComponent:selectedFlightDeparture selected', this.selectedDepartureFlight);
  }

  /*****************************************************************************
   * 
   */
   selectedFlightReturn(event) {
    console.log("OffersFlightsComponent:selectedFlightReturn called", event);

    //find the flight number in the selectedFlightReturn
    for(var i = 0; i < this.flightReturnData.length; i++) {
      if(this.flightReturnData[i].flight === event) {
        this.selectedReturnFlight = this.flightReturnData[i];
        this.sessionService.setSelectedFlightReturn(this.selectedReturnFlight);
        this.nextStep();
        break;
      }
    }

    if(this.selectedDepartureFlight && this.selectedReturnFlight) {
      this.isBookDisabled = false;
    }

    console.log('OffersFlightsComponent:selectedFlightReturn selected', this.selectedReturnFlight);
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    if(this.step === 0 && !this.isRoundTrip) //skip 1
      this.step = 2;
    else
      this.step++;
  }

  prevStep() {

    if(this.step === 2 && !this.isRoundTrip) //skip 1
      this.step = 0;
    else
      this.step--;

  }

  /*********************************************************
   * 
   */
   book() {
    this.hasError = false;

    var dataToPost = this.selectedDepartureFlight;
    dataToPost['adults'] = this.flightRequest.adults;
    dataToPost['children'] = this.flightRequest.children;

    this.flightsService.book(dataToPost).subscribe( (data) => {
      console.log('OffersFlightsComponent.book', data);
      this.confirmationNumber = data['confirmation'];
      this.sessionService.setSelectedFlightDeparture(null);

      if(this.isRoundTrip) {
        dataToPost = this.selectedDepartureFlight;
        dataToPost['adults'] = this.flightRequest.adults;
        dataToPost['children'] = this.flightRequest.children;

        this.flightsService.book(dataToPost).subscribe( (data) => {
          console.log('OffersFlightsComponent.book roundtrip', data);
          this.confirmationNumber = this.confirmationNumber + ' AND ' + data['confirmation'];
          this.sessionService.setSelectedFlightReturn(null);
          this.isBooked = true;

        }, (err) => {
          console.log('OffersFlightsComponent.book roundtrip', err);
          this.hasError = true;
          this.errorMessage = 'Booking Failed';
        }, () => {
          console.log('OffersFlightsComponent.book completed roundtrip');
        });
      } else {
        this.isBooked = true;
      }
 
    }, (err) => {
      console.log('OffersFlightsComponent.book', err);
      this.hasError = true;
      this.errorMessage = 'Booking Failed';
    }, () => {
      console.log('OffersFlightsComponent.book completed');
    });

 }

}//end class
