export interface Airport {
    icoa: string;
    name: string;
    display: string;
    lat: number;
    lon: number;

}

export interface Airports {
    airports: Airport[]
}