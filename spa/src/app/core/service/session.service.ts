import { Injectable } from '@angular/core';
import { PreloadAllModules } from '@angular/router';
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

    /*****************************************
     * 
     */
     formatDateMMDDYYY(param:Date):string {
        var ret = null;
        console.log("formatDateMMDDYYY", param);

        if(!param)
            return;

        ret = this.pad2Digit(param.getMonth() + 1);
        ret = ret + "/";
        ret = ret + this.pad2Digit(param.getDate());
        ret = ret + "/";
        ret = ret + param.getFullYear();

        console.log("formatDateMMDDYYY ret", ret);
        return ret;
    }

    /*****************************************
     * 
     */
    pad2Digit(i:number):string {
        let ret = '';

        if(i < 9) {
            ret = '0'
        }
        ret = ret + '' + i + '';
        return ret;
    }

    /*****************************************
     * 
     */
    toTime(param:Date):string {
        let ret = null;
    
        if(!param)
          return ret;
    
        var hours:string = param.getHours() + '';
        var minutes = ':' + this.pad2Digit(param.getMinutes());
        var suffix = 'pm';

        if(param.getHours() > 12) {
            hours = (param.getHours() - 11) + '';
        } else if(param.getHours() === 0) {
            hours = '12';
            suffix = 'am';
        } else {
            suffix = 'am';
        }

        if(param.getHours() === 0 && param.getMinutes() === 0) {
            hours = '12';
            minutes = ':00';
            suffix = ' (mid-night)';
        } else if (param.getHours() === 12 && param.getMinutes() === 0) {
            hours = '12';
            minutes = ':00';
            suffix = ' (noon)';
        }

        ret = hours + minutes + suffix;
    
        return ret;
      }

}