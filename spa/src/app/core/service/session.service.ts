import { Injectable } from '@angular/core';
import { FlightsRequest} from '../interfaces/flights';

@Injectable({
    providedIn: 'root',
})
export class SessionService {

    flightsRequest:FlightsRequest = null;

    /***************************************
     */
    constructor() {}

    /***************************************
     * 
     */
    setFlightRequest(flightsRequest:FlightsRequest) {
        this.flightsRequest = flightsRequest;
    }

    /***************************************
     * 
     */
     getFlightsRequest():FlightsRequest {
        return this.flightsRequest;
    }

}