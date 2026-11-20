import {JournalEvent} from "./index";

// { "timestamp":"2026-10-23T23:04:23Z", "event":"CarrierLocation", "CarrierType":"FleetCarrier", "CarrierID":3710508288, "StarSystem":"LHS 1379", "SystemAddress":671491171753, "BodyID":14 }
export type FleetCarrierEvent = JournalEvent & {
    CarrierType: "FleetCarrier";
    CarrierID: number;
    StarSystem: string;
    SystemAddress: number;
    BodyID: number;
}
