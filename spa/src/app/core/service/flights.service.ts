import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { FlightsRequest, FlightsResponse, FlightsData} from '../interfaces/flights';

@Injectable({
    providedIn: 'root',
})
export class FlightsService {

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
    getFlights(request:FlightsRequest): Observable<FlightsResponse> {

        //Build our QueryString
        let filter = "?";
        filter = filter + "?fr=" + request.from;
        filter = filter + "&to=" + request.to;
        filter = filter + "&ad=" + request.adults;
        filter = filter + "&ch=" + request.children;
        filter = filter + "&rt=" + request.roundTrip;
        filter = filter + "&de=" + request.dateDeparture;
        filter = filter + "&re=" + request.dateReturn;

        return this.http.get<any>(this.apiURL + '/flights' + filter)
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