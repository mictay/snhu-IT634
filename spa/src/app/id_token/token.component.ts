import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ProfileService, Profile, ProfileUser } from '../core/service/profile.service';
import { SessionService } from '../core/service/session.service';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
})
export class TokenComponent implements OnInit {
  hasUser:boolean = true;
  profileData:any = null;
  loginURL:string = null;
  tableData:any[];
  displayedColumns: string[] = ['flight', 'departing', 'departs', 'arrives'];

  /*****************************************************************************
   * 
   * "http://localhost:4200/#
   *  id_token=eyJraWQiOiI1dzQ2cU5hUmVWenA5R3VldDUrbjNGbmVqVjR1Q0xPcFdtclN1N0NGZnZBPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiUm5QMTEtUmZQaVg0V1RRN0kyMk5EdyIsInN1YiI6IjI0NGEwYzNlLWRjMWMtNDUzOS04ZmUxLTgxMjhiYWRmZTBkMSIsImF1ZCI6IjVxbnAwcnF1dXZrajgxZXFzdjFxYTFzaTFrIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MjU1MTkyODgsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xXzBzMXBnZ1VCMCIsIm5hbWUiOiJNaWNoYWVsIiwiY29nbml0bzp1c2VybmFtZSI6Im1pY3RheTE5NjkiLCJleHAiOjE2MjU1MjI4ODgsImlhdCI6MTYyNTUxOTI4OCwianRpIjoiODBlZjUxM2ItYThkZS00YmRlLWI5Y2EtMGI0ZTE0YTk5NTZkIn0.MFZeJ0edd9LNsOfg1S12x23_MGgZzZfnFpXXnfEMw2YTSc2BpUcH6_X6AFEitH2NIyl5AlJ4cMoMLBlH_NOsS69-8-glkcL2bm7B9zOjnWgzx_eXiMOJr5j1gv2rik-4s6TMGpq8solGZuTshRRjNWjjeTMAGf49D4xGHRFhOm5w7cnIMr3yGXIEc06FW047HJMTOtz-9ZZiu9GE9XuyIu9aqm4yj4npOd2mnZnvWKiSaKQy9eZXs_ZIO-gUoavLPfar_u62DM_T6mJj59Y8Q3bGlgSG2iyfufc2VnLzrPmI9yL80LH6fWfGI9yCX2gensqYXUiuoFjoVhi03nYN_g
   *  &access_token=eyJraWQiOiJTT0xwanFGaGFxUnFuNElKQTlSUElzaVVWRUJ1ajdYZ2FaU2VjWE5GXC8rMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyNDRhMGMzZS1kYzFjLTQ1MzktOGZlMS04MTI4YmFkZmUwZDEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjI1NTE5Mjg4LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV8wczFwZ2dVQjAiLCJleHAiOjE2MjU1MjI4ODgsImlhdCI6MTYyNTUxOTI4OCwidmVyc2lvbiI6MiwianRpIjoiYzVkZmUxMGQtM2MxOS00MjJjLWE5YmMtOWZjY2FmZDY5MWRkIiwiY2xpZW50X2lkIjoiNXFucDBycXV1dmtqODFlcXN2MXFhMXNpMWsiLCJ1c2VybmFtZSI6Im1pY3RheTE5NjkifQ.IQUcKNW0OzbtKjOkgIYeIx-7ciAONc5mQpgLXsb1p_BoN2lhWmlbuFlteaPsjJIeYNVUde37i8ljFpdQJO3WlCGvlhFgFn74M995XTTesm9nn1VgDiTdZbABuNuuzvrAVjS-ggS7kPnp5NhitHhzb7tcU1qXaY8ooMBDR0gEb7b7HODuLXKeSrhi_PDDI3lltf2nqhsb9Gl0iORbEaJq8Hx_YeC4y_tgKk0F6_6dEmBUhlLYaI_JsKevLawV1Y5tRqAXDKBlG8PbcfXnBGExfOKyVlA1k7B6Dg_RcqpMJGlabjSFbs_hV0y0hHrE9a0F3ULox_G3iLYbilyPwBRmjg
   *  &expires_in=3600
   * &token_type=Bearer"
   *
   * 
   */
  constructor(private router:Router, private profileService:ProfileService, private sessionService:SessionService) {
    console.log('TokenComponent tokenURL', sessionStorage.getItem('tokenURL'));
    this.loginURL = profileService.getSigninURL();
  }

  /*****************************************************************************
   */
  ngOnInit() {
    console.log('TokenComponent ngOnInit called');
    var parsedToken = this.parseTokenURLForToken();

    if(parsedToken) {
      this.profileService.setToken(parsedToken);
    }

    //check if we have a tokenURL sessionStorage
    if(this.profileService.hasToken()) {      
      this.getUserInformation();
    } else {
      //DO SOMETHHING ELSE, NOT LOGGED IN
      console.log('TokenComponent ngOnInit no token');
    }

  }

  /*******************************************************************
   * 
   */
   parseTokenURLForToken():string {
    let ret = null;

    let url = sessionStorage.getItem('tokenURL');
    let start = url.indexOf('id_token=');

    if(start > -1) {
      start = start + 'id_token='.length;
    } else {
      return null;
    }

    let end = url.indexOf('&', start);

    if(end > -1) {
      ret = url.substring(start, end);
    }

    return ret;
  }

  /*******************************************************************
   * 
   */
  getUserInformation() {

    this.profileService.getProfile().subscribe( (data:Profile) => {
      console.log('TokenComponent.getUserInformation() data', data);
      this.profileData = data;
      this.hasUser = true;

      if(!data['booked'])
        return;

      var booked = data['booked'];

      //['flight', 'departing', 'departs', 'time, 'arrives'];
      const tempTable = [];
      for(var i = 0; i < booked.length; i++) {

        var flightdata = JSON.parse(booked[i]['flightdata']);

        var flight = {
          flight: flightdata.flight,
          departing: flightdata.fromDisplayName,
          departs: this.sessionService.formatDateMMDDYYY( new Date(flightdata.departs)),
          time: 'test',
          arrives: flightdata.toDisplayName,
        };
        tempTable.push(flight);
      }

      this.tableData = tempTable;

    }, (error) => {
      console.log('TokenComponent.getUserInformation() error', error);
    }, () => {
      console.log('TokenComponent.getUserInformation() complete');
    });

  }

}
