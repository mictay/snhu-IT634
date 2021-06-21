import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SessionService } from './session.service';
import { WeatherRequest, WeatherResponse } from '../interfaces/weather';


@Injectable({
    providedIn: 'root',
})
export class WeatherService {

    apiURL = 'https://api.openweathermap.org';
    apiKey = '04a068829101c712d9e1643f4b09eeee';

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json'
        })
    }  

    constructor(private http: HttpClient, private sessionService:SessionService) {}

    /***************************************
     * 
     */
    getWeather(request:WeatherRequest): Observable<WeatherResponse> {

        //Build our QueryString
        let filter = "?lat=" + request.lat.toFixed(4) ;
        filter = filter + "&lon=" + request.lon.toFixed(4) ;
        filter = filter + "&appid=" + this.apiKey;
        filter = filter + "&units=imperial";
        console.log('WeatherService->getWeather', filter);

        return this.http.get<any>(this.apiURL + '/data/2.5/weather' + filter)
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