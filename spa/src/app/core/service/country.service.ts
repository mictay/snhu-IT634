import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CountryService {

    apiURL = 'https://restcountries.eu';

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
    getCountry(countyCode:string): Observable<any> {

        //Build our QueryString
        let filter = countyCode.toLowerCase();

        return this.http.get<any>(this.apiURL + '/rest/v2/alpha/' + filter)
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