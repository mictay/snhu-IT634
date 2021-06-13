import { Component, OnInit } from '@angular/core';
import { Airport } from '../../core/interfaces/airport';
import { AirportService } from '../../core/service/airport.service';

@Component({
  selector: 'app-search-flights',
  templateUrl: './search-flights.component.html',
  styleUrls: ['./search-flights.component.scss'],
})
export class SearchFlightsComponent implements OnInit {

  airportsFrom: Airport[] = [];
  airportsTo: Airport[] = [];

  // Initially fill the selectedAirport so it can be used in the for loop
  selectedAirportFrom: Airport = null;
  selectedAirportTo: Airport = null;

  constructor(private airportService: AirportService) {

  }

  ngOnInit() {}

  /**
   * 
   * @param value 
   */
  // Receive user input and send to search method**
  onKeyFrom(value) { 

    if(this.search(value))
      this.search(value).then( (data:Airport[]) => {
        console.log("onKeyFrom", data);
        this.airportsFrom = data;
      } ).catch( (err) => {
        console.log(err);
      });

  }

  // Receive user input and send to search method**
  onKeyTo(value) { 

    if(this.search(value))
      this.search(value).then( (data:Airport[]) => {
        this.airportsTo = data;
      } ).catch( (err) => {
        console.log(err);
      });

  }

  // Filter the states list and send back to populate the selectedStates**
  search(value: string): Promise<any> { 

    return new Promise<Airport[]>( (resolve, reject) => {
      let filter = value.toLowerCase();
      this.airportService.getAirports(value).subscribe( (data) => {
        //console.log(data);

        let ret:Airport[] = [];

        if (data && data.airports)
          ret = data.airports;
        resolve(ret);

      });

    });

    //return [];
    //return this.airportService.getAirports(value);
    //return this.allAirports.filter(option => option.name.toLowerCase().includes(filter));
  }

}
