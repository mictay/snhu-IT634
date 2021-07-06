/***********
 * login url: 
 * https://snhu-it634.auth.us-east-1.amazoncognito.com/login?client_id=5qnp0rquuvkj81eqsv1qa1si1k&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:4200
 * 
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SessionService } from './session.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {

    apiURL = 'https://va9ka2mpt0.execute-api.us-east-1.amazonaws.com/api';

    /***************************************
     */
     constructor(private http: HttpClient, private sessionService:SessionService) {}

    getSigninURL() {

        if(window.location.href.indexOf('localhost') > -1) {
            console.log('localhost login');
            return "https://snhu-it634.auth.us-east-1.amazoncognito.com/login?client_id=5qnp0rquuvkj81eqsv1qa1si1k&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:4200";
        } else if(window.location.href.indexOf('s3-website-us-east-1') > -1) {
            console.log('s3 site login');
            return "https://snhu-it634.auth.us-east-1.amazoncognito.com/login?client_id=5qnp0rquuvkj81eqsv1qa1si1k&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://it634.mictay.com.s3-website-us-east-1.amazonaws.com";
        } else {
            console.log('cloudfront site login');
            return "https://snhu-it634.auth.us-east-1.amazoncognito.com/login?client_id=5qnp0rquuvkj81eqsv1qa1si1k&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://d1i83h7yfh6s26.cloudfront.net";
        }

    }

    /***************************************
     * 
     */
     getToken():string {
        return sessionStorage.getItem('TOKEN');
    }

    /***************************************
     * 
     */
     hasToken():boolean {
        return !!sessionStorage.getItem('TOKEN');
    }

    /***************************************
     * 
     */
     setToken(param:string) {

        if(!param || param === 'null') {
            sessionStorage.removeItem('TOKEN');
        } else {
            sessionStorage.setItem('TOKEN', param);
        }

    }

    /***************************************
     * 
     */
     getProfile(): Observable<Profile> {

        return this.http.get<Profile>(this.apiURL + '/user')
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

//{"user":{"pk":"users","name":"Michael","sk":"mictay1969"}}
export interface Profile {
    user: ProfileUser;
}

export interface ProfileUser {
    pk: string;
    name: string;
    sk: string
}