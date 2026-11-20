// { "timestamp":"2026-10-23T23:04:53Z", "event":"Powerplay", "Power":"Yuri Grom", "Rank":38, "Merits":279090, "TimePledged":45047740 }
export interface PowerplayEvent {
    Power: string;
    Rank: number;
    Merits: number;
    TimePledged: number;
}