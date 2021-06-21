export interface Airport {
    icoa: string;
    name: string;
    display: string;
    lat: number;
    lon: number;
    displayName: string;
    tz: string;
    country: string;
}

export interface Airports {
    airports: Airport[]
}