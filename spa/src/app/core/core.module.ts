import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';
import { AirportService } from './service/airport.service';
import { ProfileService } from './service/profile.service';
import { FlightsService } from './service/flights.service';
import { DynamicScriptLoaderService } from './service/dynamic-script-loader.service';
import { throwIfAlreadyLoaded } from './guard/module-import.guard';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [],
  imports: [BrowserModule, CommonModule, HttpClientModule],
  providers: [
    AuthGuard,
    AuthService,
    DynamicScriptLoaderService,
    AirportService,
    ProfileService,
    FlightsService
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
