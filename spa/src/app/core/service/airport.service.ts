import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Airport, Airports } from '../interfaces/airport';

@Injectable({
    providedIn: 'root',
})
export class AirportService {

    apiURL = 'https://va9ka2mpt0.execute-api.us-east-1.amazonaws.com/api';

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json'
        })
    }  

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
        //window.alert(errorMessage);
        return throwError(errorMessage);
    }

}