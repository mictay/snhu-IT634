import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    // let currentUser = this.authenticationService.currentUserValue;

    // if (currentUser && currentUser.token) {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${currentUser.token}`,
    //     },
    //   });
    // }
    console.log('JwtInterceptor called', request);

    //Only need the authorization header on the aws calls
    if(request.url.indexOf('/api/user') > - 1 || request.url.indexOf('/api/book') > -1) {

      if(sessionStorage.getItem('TOKEN')) {
        request = request.clone({
          setHeaders: {
            Authorization: sessionStorage.getItem('TOKEN')
          },
        });
      }

    }

    return next.handle(request);
  }
}
