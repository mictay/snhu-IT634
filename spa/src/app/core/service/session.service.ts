import { Injectable } from '@angular/core';
import { PreloadAllModules } from '@angular/router';
import { Flight, FlightsRequest} from '../interfaces/flights';

@Injectable({
    providedIn: 'root',
})
export class SessionService {

    flightsRequest:FlightsRequest = null;

    /***************************************
     */
    constructor() {}

    /***************************************
     */
     setSelectedFlightDeparture(param:Flight) {

        if(param)
            sessionStorage.setItem('SELECTED_FLIGHT_DEPARTURE', JSON.stringify(param));
        else
            sessionStorage.removeItem('SELECTED_FLIGHT_DEPARTURE');

    }

    /***************************************
     */
    getSelectedFlightDeparture() {
        let ret:Flight = null;
        let sRet = sessionStorage.getItem('SELECTED_FLIGHT_DEPARTURE');

        if(sRet) {
            ret = JSON.parse(sRet);
        }

        return ret;
    }

    /***************************************
     */
     setSelectedFlightReturn(param:Flight) {

        if(param)
            sessionStorage.setItem('SELECTED_FLIGHT_RETURN', JSON.stringify(param));
        else
            sessionStorage.removeItem('SELECTED_FLIGHT_RETURN');

    }

    /***************************************
     */
    getSelectedFlightReturn() {
        let ret:Flight = null;
        let sRet = sessionStorage.getItem('SELECTED_FLIGHT_RETURN');

        if(sRet) {
            ret = JSON.parse(sRet);
        }

        return ret;
    }

    /***************************************
     * 
     */
    setFlightRequest(flightsRequest:FlightsRequest) {

        if(flightsRequest)
            sessionStorage.setItem('FLIGHT_SEARCH_REQUEST', JSON.stringify(flightsRequest));
        else
            sessionStorage.removeItem('FLIGHT_SEARCH_REQUEST');
    }

    /***************************************
     * 
     */
     getFlightsRequest():FlightsRequest {
        let ret:FlightsRequest = null;
        let sRet = sessionStorage.getItem('FLIGHT_SEARCH_REQUEST');

        if(sRet) {
            ret = JSON.parse(sRet);
            ret['dateDeparture'] = new Date(ret.dateDeparture);
            ret['dateReturn'] = new Date(ret.dateReturn);
        }

        return ret;
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