import {JournalEvent, JournalEventType} from "./index";
import {SystemNameVariable} from "../variables/common";
import firebot from "@crowbartools/firebot-types";
import {EVENT_SOURCE_ID} from "../constants";
import {JournalReader} from "../reader";
import {CurrentJumpSystemNameVariable, CurrentJumpSystemStarClassVariable} from "../variables/travel";


// { "timestamp":"2026-11-18T16:11:10Z", "event":"Location", "DistFromStarLS":59.245378, "Docked":true, "StationName":"Harper Plant", "StationType":"Orbis", "MarketID":3223689472, "StationFaction":{ "Name":"Fjorgyn Crimson Public Ltd", "FactionState":"Boom" }, "StationGovernment":"$government_Corporate;", "StationGovernment_Localised":"Corporate", "StationAllegiance":"Empire", "StationServices":[ "dock", "autodock", "commodities", "contacts", "exploration", "missions", "outfitting", "crewlounge", "rearm", "refuel", "repair", "tuning", "engineer", "missionsgenerated", "flightcontroller", "stationoperations", "powerplay", "searchrescue", "stationMenu", "livery", "socialspace", "bartender", "vistagenomics", "pioneersupplies", "apexinterstellar", "frontlinesolutions", "registeringcolonisation" ], "StationEconomy":"$economy_Refinery;", "StationEconomy_Localised":"Refinery", "StationEconomies":[ { "Name":"$economy_Refinery;", "Name_Localised":"Refinery", "Proportion":0.760000 }, { "Name":"$economy_Extraction;", "Name_Localised":"Extraction", "Proportion":0.240000 } ], "Taxi":false, "Multicrew":false, "StarSystem":"Fjorgyn", "SystemAddress":1281804454251, "StarPos":[38.37500,-43.71875,42.12500], "SystemAllegiance":"Empire", "SystemEconomy":"$economy_Refinery;", "SystemEconomy_Localised":"Refinery", "SystemSecondEconomy":"$economy_Extraction;", "SystemSecondEconomy_Localised":"Extraction", "SystemGovernment":"$government_Corporate;", "SystemGovernment_Localised":"Corporate", "SystemSecurity":"$SYSTEM_SECURITY_medium;", "SystemSecurity_Localised":"Medium Security", "Population":321265, "Body":"Harper Plant", "BodyID":19, "BodyType":"Station", "ControllingPower":"Zemina Torval", "Powers":[ "A. Lavigny-Duval", "Aisling Duval", "Yuri Grom", "Zemina Torval" ], "PowerplayState":"Fortified", "PowerplayStateControlProgress":0.188565, "PowerplayStateReinforcement":847, "PowerplayStateUndermining":280, "Factions":[ { "Name":"Natural Fjorgyn Liberty Party", "FactionState":"None", "Government":"Dictatorship", "Influence":0.104104, "Allegiance":"Independent", "Happiness":"$Faction_HappinessBand2;", "Happiness_Localised":"Happy", "MyReputation":0.000000 }, { "Name":"Fjorgyn Vision Industry", "FactionState":"None", "Government":"Corporate", "Influence":0.214214, "Allegiance":"Federation", "Happiness":"$Faction_HappinessBand2;", "Happiness_Localised":"Happy", "MyReputation":0.000000 }, { "Name":"Fjorgyn Blue Ring", "FactionState":"None", "Government":"Anarchy", "Influence":0.010010, "Allegiance":"Independent", "Happiness":"$Faction_HappinessBand2;", "Happiness_Localised":"Happy", "MyReputation":0.000000, "RecoveringStates":[ { "State":"Bust", "Trend":0 } ] }, { "Name":"Fjorgyn Crimson Public Ltd", "FactionState":"Boom", "Government":"Corporate", "Influence":0.671672, "Allegiance":"Empire", "Happiness":"$Faction_HappinessBand2;", "Happiness_Localised":"Happy", "MyReputation":0.000000, "ActiveStates":[ { "State":"Boom" } ] } ], "SystemFaction":{ "Name":"Fjorgyn Crimson Public Ltd", "FactionState":"Boom" } }
export type LocationEvent = JournalEvent & {
    StarSystem: string;
    SystemAddress: number;
    StarClass: string;
    Docked: boolean;
    Population: number;
}
export const LocationEvent = {
    constructor(raw: LocationEvent) {
        SystemNameVariable.setVariable(raw.StarSystem);
        firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Location, raw).finally();
    }
}

// { "timestamp":"2026-10-23T23:10:28Z", "event":"StartJump", "JumpType":"Hyperspace", "Taxi":false, "StarSystem":"Kuk", "SystemAddress":24859942069665, "StarClass":"M" }
export type StartJumpEvent = JournalEvent & {
    StarSystem: string;
    SystemAddress: number;
    StarClass: string;
    JumpType: string;
    Taxi: boolean;
}
export const StartJumpEvent = {
    constructor(raw: StartJumpEvent) {
        CurrentJumpSystemNameVariable.setVariable(raw.StarSystem);
        CurrentJumpSystemStarClassVariable.setVariable(raw.StarClass);
        // TargetSystemJumpTypeVariable.setVariable(raw.JumpType);
        // TargetSystemTaxiVariable.setVariable(raw.Taxi);
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.StartJump, raw).finally();
    }
}

// { "timestamp":"2026-10-23T23:10:47Z", "event":"FSDJump", "Taxi":false, "Multicrew":false, "StarSystem":"Kuk", "SystemAddress":24859942069665, "StarPos":[-21.28125,69.09375,-16.31250], "SystemAllegiance":"Alliance", "SystemEconomy":"$economy_Industrial;", "SystemEconomy_Localised":"Industrial", "SystemSecondEconomy":"$economy_Refinery;", "SystemSecondEconomy_Localised":"Refinery", "SystemGovernment":"$government_Confederacy;", "SystemGovernment_Localised":"Confederacy", "SystemSecurity":"$SYSTEM_SECURITY_high;", "SystemSecurity_Localised":"High Security", "Population":60950917, "Body":"Kuk", "BodyID":1, "BodyType":"Star", "ControllingPower":"Edmund Mahon", "Powers":[ "Edmund Mahon" ], "PowerplayState":"Stronghold", "PowerplayStateControlProgress":0.046504, "PowerplayStateReinforcement":278, "PowerplayStateUndermining":174, "JumpDist":8.866, "FuelUsed":0.129854, "FuelLevel":63.870148, "Factions":[ { "Name":"Social Kuk Liberals", "FactionState":"CivilWar", "Government":"Democracy", "Influence":0.083168, "Allegiance":"Alliance", "Happiness":"$Faction_HappinessBand2;", "Happiness_Localised":"Happy", "MyReputation":0.000000, "ActiveStates":[ { "State":"Boom" }, { "State":"CivilWar" } ] }, { "Name":"Kuk Jet Comms & Co", "FactionState":"None", "Government":"Corporate", "Influence":0.111881, "Allegiance":"Alliance", "Happiness":"$Faction_HappinessBand2;", "Happiness_Localised":"Happy", "MyReputation":0.000000 }, { "Name":"Kuk Bureau", "FactionState":"CivilWar", "Government":"Dictatorship", "Influence":0.073267, "Allegiance":"Independent", "Happiness":"$Faction_HappinessBand2;", "Happiness_Localised":"Happy", "MyReputation":0.000000, "ActiveStates":[ { "State":"CivilWar" } ] }, { "Name":"Kuk Silver Fortune Company", "FactionState":"CivilWar", "Government":"Corporate", "Influence":0.073267, "Allegiance":"Alliance", "Happiness":"$Faction_HappinessBand2;", "Happiness_Localised":"Happy", "MyReputation":0.000000, "ActiveStates":[ { "State":"CivilWar" } ] }, { "Name":"Terran Colonial Forces", "FactionState":"None", "Government":"Confederacy", "Influence":0.438614, "Allegiance":"Alliance", "Happiness":"$Faction_HappinessBand2;", "Happiness_Localised":"Happy", "MyReputation":100.000000, "PendingStates":[ { "State":"Expansion", "Trend":0 } ] }, { "Name":"Perez Ring Brewery", "FactionState":"Expansion", "Government":"Corporate", "Influence":0.136634, "Allegiance":"Alliance", "Happiness":"$Faction_HappinessBand2;", "Happiness_Localised":"Happy", "MyReputation":6.889140, "ActiveStates":[ { "State":"Outbreak" }, { "State":"Boom" }, { "State":"Expansion" } ] }, { "Name":"Order of Kuk", "FactionState":"CivilWar", "Government":"Dictatorship", "Influence":0.083168, "Allegiance":"Independent", "Happiness":"$Faction_HappinessBand2;", "Happiness_Localised":"Happy", "MyReputation":0.000000, "ActiveStates":[ { "State":"CivilWar" } ] } ], "SystemFaction":{ "Name":"Terran Colonial Forces" }, "Conflicts":[ { "WarType":"civilwar", "Status":"active", "Faction1":{ "Name":"Social Kuk Liberals", "Stake":"Harrison Enterprise", "WonDays":1 }, "Faction2":{ "Name":"Order of Kuk", "Stake":"", "WonDays":2 } }, { "WarType":"civilwar", "Status":"active", "Faction1":{ "Name":"Kuk Bureau", "Stake":"", "WonDays":0 }, "Faction2":{ "Name":"Kuk Silver Fortune Company", "Stake":"Joshi's Vista", "WonDays":3 } } ] }
export type FSDJumpEvent = JournalEvent & {
    Taxi: boolean;
    StarSystem: string;
    StarClass: string;
    JumpDist: number;
    FuelUsed: number;
    FuelLevel: number;
    TravelClass: string;
    Population: number;
}
export const FSDJumpEvent = {
    constructor(raw: FSDJumpEvent) {
        SystemNameVariable.setVariable(raw.StarSystem);
        firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Location, raw).finally();
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.FSDJump, raw).finally();
    }
}

// { "timestamp":"2026-11-19T00:16:20Z", "event":"SupercruiseEntry", "Taxi":false, "Multicrew":false, "StarSystem":"Fjorgyn", "SystemAddress":1281804454251 }
export type SupercruiseEntryEvent = JournalEvent & {
    Taxi: boolean;
    Multicrew: boolean;
    StarSystem: string;
    SystemAddress: number;
}
export const SupercruiseEntryEvent = {
    constructor(raw: SupercruiseEntryEvent) {
        SystemNameVariable.setVariable(raw.StarSystem);
        firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Location, raw).finally();
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.SupercruiseEntry, raw).finally();
    }
}

// { "timestamp":"2026-11-18T22:09:53Z", "event":"SupercruiseExit", "Taxi":false, "Multicrew":false, "StarSystem":"Mbooni", "SystemAddress":1733119939282, "Body":"Mbooni 3 a", "BodyID":24, "BodyType":"Planet" }
export type SupercruiseExitEvent = JournalEvent & {
    Taxi: boolean;
    Multicrew: boolean;
    StarSystem: string;
    SystemAddress: number;
    Body: string;
    BodyID: number;
    BodyType: string;
}
export const SupercruiseExitEvent = {
    constructor(raw: SupercruiseExitEvent) {
        SystemNameVariable.setVariable(raw.StarSystem);
        firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Location, raw).finally();
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.SupercruiseExit, raw).finally();
    }
}

// { "timestamp":"2026-11-18T22:09:05Z", "event":"ApproachBody", "StarSystem":"Mbooni", "SystemAddress":1733119939282, "Body":"Mbooni 3 a", "BodyID":24 }
export type ApproachBodyEvent = JournalEvent & {
    StarSystem: string;
    SystemAddress: number;
    Body: string;
    BodyID: number;
}
export const ApproachBodyEvent = {
    constructor(raw: ApproachBodyEvent) {
        SystemNameVariable.setVariable(raw.StarSystem);
        firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Location, raw).finally();
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.ApproachBody, raw).finally();
    }
}


// { "timestamp":"2024-12-06T16:55:54Z", "event":"ApproachSettlement", "Name":"Schade Horizons", "MarketID":3534446848, "StationFaction":{ "Name":"G 41-14 Purple Travel Solutions" }, "StationGovernment":"$government_Corporate;", "StationGovernment_Localised":"Corporate", "StationAllegiance":"Federation", "StationServices":[ "dock", "missions", "rearm", "refuel", "repair", "missionsgenerated", "flightcontroller", "stationoperations", "stationMenu", "shop", "bartender", "vistagenomics", "pioneersupplies" ], "StationEconomy":"$economy_Colony;", "StationEconomy_Localised":"Colony", "StationEconomies":[ { "Name":"$economy_Colony;", "Name_Localised":"Colony", "Proportion":1.000000 } ], "SystemAddress":800751356267, "BodyID":4, "BodyName":"Procyon A 1 a", "Latitude":-20.074551, "Longitude":-121.513954 }
export type ApproachSettlementEvent = JournalEvent & {
    Name: string,
    MarketID: number,
    SystemAddress: number
    BodyID: number
    BodyName: string
    Latitude: number
    Longitude: number
}
export const ApproachSettlementEvent = {
    constructor(raw: ApproachSettlementEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.ApproachSettlement, raw).finally();
    }
}

// { "timestamp":"2026-11-19T00:16:49Z", "event":"LeaveBody", "StarSystem":"Fjorgyn", "SystemAddress":1281804454251, "Body":"Fjorgyn A 1", "BodyID":11 }
export type LeaveBodyEvent = ApproachBodyEvent;
export const LeaveBodyEvent = {
    constructor(raw: LeaveBodyEvent) {
        SystemNameVariable.setVariable(raw.StarSystem);
        firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Location, raw).finally();
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.LeaveBody, raw).finally();
    }
}

// { "timestamp":"2026-11-18T22:10:58Z", "event":"Touchdown", "PlayerControlled":true, "Taxi":false, "Multicrew":false, "StarSystem":"Mbooni", "SystemAddress":1733119939282, "Body":"Mbooni 3 a", "BodyID":24, "OnStation":false, "OnPlanet":true, "Latitude":82.255394, "Longitude":-17.107090 }
export type TouchdownEvent = JournalEvent & {
    PlayerControlled: boolean;
    Taxi: boolean;
    Multicrew: boolean;
    SystemAddress: number;
    StarSystem: string;
    Body: string;
    BodyID: number;
    OnStation: boolean;
    OnPlanet: boolean;
    Latitude: number;
    Longitude: number;
}
export const TouchdownEvent = {
    constructor(raw: TouchdownEvent) {
        SystemNameVariable.setVariable(raw.StarSystem);
        firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Location, raw).finally();
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Touchdown, raw).finally();
    }
}

// { "timestamp":"2026-11-18T22:11:27Z", "event":"Disembark", "SRV":false, "Taxi":false, "Multicrew":false, "ID":33, "StarSystem":"Mbooni", "SystemAddress":1733119939282, "Body":"Mbooni 3 a", "BodyID":24, "OnStation":false, "OnPlanet":true }
export type DisembarkEvent = JournalEvent & {
    SRV: boolean;
    Taxi: boolean;
    Multicrew: boolean;
    ID: number;
    StarSystem: string;
    SystemAddress: number;
    Body: string;
    BodyID: number;
    OnStation: boolean;
    OnPlanet: boolean;
}
export const DisembarkEvent = {
    constructor(raw: DisembarkEvent) {
        SystemNameVariable.setVariable(raw.StarSystem);
        firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Location, raw).finally();
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Disembark, raw).finally();
    }
}

export type EmbarkEvent = DisembarkEvent;
export const EmbarkEvent = {
    constructor(raw: EmbarkEvent) {
        SystemNameVariable.setVariable(raw.StarSystem);
        firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Location, raw).finally();
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Embark, raw).finally();
    }
}

// { "timestamp":"2026-11-20T01:10:39Z", "event":"LaunchVessel", "VesselType":"lander01", "VesselType_Localised":"Nomad", "Loadout":"starter", "ID":34, "PlayerControlled":true }
export type LaunchVesselEvent = JournalEvent & {
    VesselType: string;
    VesselType_Localised: string;
    Loadout: string;
    ID: number;
    PlayerControlled: boolean;
}
export const LaunchVesselEvent = {
    constructor(raw: LaunchVesselEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.LaunchVessel, raw).finally();
    }
}

// { "timestamp":"2026-11-18T22:13:38Z", "event":"LaunchSRV", "SRVType":"testbuggy", "SRVType_Localised":"SRV Scarab", "Loadout":"starter", "ID":35, "PlayerControlled":true }
export type LaunchSRVEvent = JournalEvent & {
    SRVType: string;
    SRVType_Localised: string;
    Loadout: string;
    ID: number;
    PlayerControlled: boolean;
}
export const LaunchSRVEvent = {
    constructor(raw: LaunchSRVEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.LaunchSRV, raw).finally();
    }
}

// { "timestamp":"2026-11-18T22:19:30Z", "event":"DockSRV", "SRVType":"testbuggy", "SRVType_Localised":"SRV Scarab", "ID":35 }
export type DockSRVEvent = JournalEvent & {
    SRVType: string;
    SRVType_Localised: string;
    ID: number;
}
export const DockSRVEvent = {
    constructor(raw: DockSRVEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.DockSRV, raw).finally();
    }
}

// { "timestamp":"2026-11-18T22:39:03Z", "event":"Liftoff", "PlayerControlled":true, "Taxi":false, "Multicrew":false, "StarSystem":"Mbooni", "SystemAddress":1733119939282, "Body":"Mbooni 3 a", "BodyID":24, "OnStation":false, "OnPlanet":true, "Latitude":82.255394, "Longitude":-17.107088 }
export type LiftoffEvent = JournalEvent & {
    PlayerControlled: boolean,
    Taxi: boolean,
    Multicrew: boolean,
    StarSystem: string;
    SystemAddress: number;
    Body: string;
    BodyID: number;
    OnStation: boolean;
    OnPlanet: boolean;
    Latitude: number;
    Longitude: number;
}
export const LiftoffEvent = {
    constructor(raw: LiftoffEvent) {
        SystemNameVariable.setVariable(raw.StarSystem);
        firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Location, raw).finally();
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Liftoff, raw).finally();
    }
}


// { "timestamp":"2024-10-25T13:05:26Z", "event":"Docked", "StationName":"Alexander Enterprise", "StationType":"Coriolis", "Taxi":false, "Multicrew":false, "StarSystem":"Allobog", "SystemAddress":93318364810160, "MarketID":3221838848, "StationFaction":{ "Name":"The Black Widow Corps", "FactionState":"Boom" }, "StationGovernment":"$government_Confederacy;", "StationGovernment_Localised":"Confederacy", "StationServices":[ "dock", "autodock", "blackmarket", "commodities", "contacts", "exploration", "missions", "outfitting", "crewlounge", "rearm", "refuel", "repair", "shipyard", "tuning", "engineer", "missionsgenerated", "facilitator", "flightcontroller", "stationoperations", "powerplay", "searchrescue", "stationMenu", "shop", "livery", "socialspace", "bartender", "vistagenomics", "pioneersupplies", "apexinterstellar", "frontlinesolutions" ], "StationEconomy":"$economy_Terraforming;", "StationEconomy_Localised":"Terraforming", "StationEconomies":[ { "Name":"$economy_Terraforming;", "Name_Localised":"Terraforming", "Proportion":1.000000 } ], "DistFromStarLS":29.782030, "LandingPads":{ "Small":17, "Medium":18, "Large":9 } }
export type DockedEvent = JournalEvent & {
    StationName: string
    StationType: string
    Taxi: boolean
    Multicrew: boolean
    StarSystem: string
    SystemAddress: number
}
export const DockedEvent = {
    constructor(raw: DockedEvent) {
        SystemNameVariable.setVariable(raw.StarSystem);
        firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Location, raw).finally();
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Docked, raw).finally();
    }
}

// { "timestamp":"2026-11-18T23:19:58Z", "event":"Undocked", "StationName":"Harper Plant", "StationType":"Orbis", "MarketID":3223689472, "Taxi":false, "Multicrew":false }
export type UndockedEvent = JournalEvent & {
    StationName: string
    StationType: string
    MarketID: number
    Taxi: boolean
    Multicrew: boolean
}
export const UndockedEvent = {
    constructor(raw: UndockedEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Undocked, raw).finally();
    }
}
