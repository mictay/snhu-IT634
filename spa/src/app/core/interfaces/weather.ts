export interface WeatherRequest {
    lon: number;
    lat: number;
}

export interface WeatherResponse {
    coord: any;
    weather: WeatherData[];
    base: string;
    main: WeatherMain;
    visibility: number;
    wind: any;
    clouds: any;
    dt: number;
    sys: any;
    timezone: number;
    id: string;
    cod: number;
}

export interface WeatherData {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface WeatherMain {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}