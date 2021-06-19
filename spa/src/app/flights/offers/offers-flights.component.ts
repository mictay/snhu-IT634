import { Component, OnInit } from '@angular/core';
import { Airport } from '../../core/interfaces/airport';
import { AirportService } from '../../core/service/airport.service';
import { SessionService } from '../../core/service/session.service';
import { FormControl } from '@angular/forms';
import { FlightsRequest } from "../../core/interfaces/flights";
import { Router } from "@angular/router";

@Component({
  selector: 'app-offers-flights',
  templateUrl: './offers-flights.component.html',
  styleUrls: ['./offers-flights.component.scss'],
})
export class OffersFlightsComponent implements OnInit {
  displayedColumns: string[] = ['flight', 'departs', 'arrives', 'price'];

  dataSource:any = [
    { flight: 1014, departs: '10:52a', arrives: '10:52a', price: '$99.99'},
    { flight: 2234, departs: '12:52p', arrives: '1:52p', price: '$99.99'},
    { flight: 3342, departs: '1:30p', arrives: '2:30p', price: '$99.99'},
    { flight: 4754, departs: '2:30p', arrives: '3:30p', price: '$99.99'},
    { flight: 5234, departs: '3:15p', arrives: '4:15p', price: '$99.99'},
    { flight: 6123, departs: '7:30p', arrives: '8:30p', price: '$99.99'},
    { flight: 7654, departs: '10:00p', arrives: '11:00p', price: '$99.99'},
    { flight: 8546, departs: '11:00p', arrives: '12:00a', price: '$99.99'},
    { flight: 9234, departs: '11:20p', arrives: '12:20a', price: '$99.99'},
    { flight: 1034, departs: '11:59p', arrives: '12:59a', price: '$99.99'}
  ];

  constructor() {
  }

  ngOnInit() {
    
  }

}
