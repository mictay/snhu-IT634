import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Airport, Airports } from '../interfaces/airport';


@Injectable({
    providedIn: 'root',
})
export class AirportService {

    apiURL = 'http://localhost:3000';

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json'
        })
    }  

    airports: Airport[] =[
        {icoa: 'ta', name: 'mike', display: 'michael taylor', lat: 1, lon: 3},
        {icoa: 'at', name: 'quinn', display: 'quinn taylor', lat: 1, lon: 3}
     ];

    constructor(private http: HttpClient) {}

    /***************************************
     * 
     */
    getAirports(filter:string): Observable<Airports> {
        return this.http.get<Airports>(this.apiURL + '/airports?q=' + filter)
        .pipe(
            retry(1),
            catchError(this.handleError)
        )
    }

    /***************************************
     * Error Handling
     */
    handleError(error) {
        let errorMessage = '';
        if(error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

}