import { Component, OnInit, Input } from '@angular/core';
import { WeatherRequest, WeatherResponse, WeatherData, WeatherMain } from '../../core/interfaces/weather';
import { WeatherService } from '../../core/service/weather.service';
import { SessionService } from '../../core/service/session.service';
import { CountryService } from '../../core/service/country.service'; 
import { Airport } from '../../core/interfaces/airport';

@Component({
  selector: 'app-weather',
  templateUrl: './weather-component.html',
  styleUrls: ['./weather-component.scss'],
})
export class WeatherComponent implements OnInit{

  @Input() title:string;
  @Input() airport:Airport;

  lblDisplayName:string = '';; //Airport Display Name
  weatherIconURL:string = '/assets/images/unknown-weather.png'; //URL for the Weather Icon
  weatherTime:string = '...';
  weatherWeather:string = '...'; //Weather description
  weatherTemperature:string = '...';
  weatherHumidity:string = '...';
  lblLat:string = '...';
  lblLon:string = '...';
  flag: string = '/assets/images/earth.png';
  countryName:string = '';

  /*****************************************************************************
   */
   constructor(private weatherService: WeatherService, private sessionService: SessionService, private countryService:CountryService) {
    console.log("WeatherComponent:constructor", "called");
  }

  /*****************************************************************************
   */
   ngOnInit() {    
    console.log("WeatherComponent:ngOnInit calls");
    console.log("WeatherComponent:ngOnInit title", this.title);
    console.log("WeatherComponent:ngOnInit title", this.airport);
    this.updateWeather();
    this.updateCountry();
  }

  /***************************************************************************
   * 
   */
   updateWeather() {

    if(!this.airport) {
      this.lblDisplayName = 'Airport Not Selected';
      return;
    }

    const lat = this.airport.lat;
    const lon = this.airport.lon;

    this.lblLat = this.airport.lat.toFixed(4);
    this.lblLon = this.airport.lon.toFixed(4);
    this.lblDisplayName = this.airport.displayName;

    var weatherRequest: WeatherRequest = {
      lat: lat,
      lon: lon
    };

    // We have enought information to populate the Weather Information
    this.weatherService.getWeather(weatherRequest).subscribe( (data:WeatherResponse) => {
      console.log("weather data", data);

      if(!data) {
        return;
      }


      // HUMIDITY & TEMPERATURE
      if(data && data.main) {
        this.weatherTemperature = data.main.temp + '\u2109';
        this.weatherHumidity = data.main.humidity + '%';
      }

      // WEATHER
      if(data && data.weather && data.weather[0]) {
        this.weatherWeather = data.weather[0].description;
      }

      // WEATHER TIME
      if(data && data.dt) {
        const wd = new Date(0);
        wd.setUTCSeconds(data.dt);

        this.weatherTime = wd.toLocaleString('en-US', {'timeZone': this.airport.tz});
      }

      // WEATHER INFORMATION
      if(data && data.weather && data.weather.length > 0) {
          var icon = data.weather[0].icon;
          this['weatherIconURL'] = 'https://openweathermap.org/img/wn/' + icon +'@2x.png';
      }

    }), (err) => {
      console.log("WeatherComponent.updateWeather error", err);
    };

  }

  /***************************************************************************
   * Get the Country Flag
   */
   updateCountry() {

    if(!this.airport || !this.airport.country) {
      this.lblDisplayName = 'Airport Not Selected';
      return;
    }

    // We have enought information to populate the Weather Information
    this.countryService.getCountry(this.airport.country).subscribe( (data:any) => {
      console.log("country data", data);

      if(!data) {
        return;
      }

      // COUNTRY NAME
      if(data.name) {
        this.countryName = data.name;        
      }

      // COUNTRY FLAG
      if(data.name) {
        this.flag = data.flag;        
      }

    }), (err) => {
      console.log("WeatherComponent.updateCountry error", err);
    };

  }

}//end class
