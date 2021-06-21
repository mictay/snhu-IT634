import { Airport } from '../interfaces/airport';

export interface FlightsRequest {
    from: Airport;
    to: Airport;
    adults: number;
    children: number;
    roundTrip: string;
    dateDeparture: Date;
    dateReturn: Date
}

export interface FlightsResponse {
    flights: FlightsData;
}

export interface FlightsData {
    adults:number;
    children:number;
    isRoundTrip:boolean;
    departureDate:string;
    returnDate:string;
    adultRatePerMile:number;
    childRatePerMile:number;
    fromAirprt:string,
    toAirport:string,
    fligthDeparture:Flight[],
    flightReturn:Flight[]
}

export interface Flight {
    flight:string;
    distance:number;
    duration:number;
    departs:string;
    arrives:string;
    cost:number;
    premiumDiscountCost:number;
    premiumDiscountReason:string;
    total:number;
    fromDisplayName:string;
    toDisplayName:string;
}