import {JournalEvent, JournalEventType} from "./index";
import {JournalReader} from "../reader";
import firebot from "@crowbartools/firebot-types";
import {EVENT_SOURCE_ID} from "../constants";
import {DockingDeniedReasonVariable} from "../variables/station-service";

// { "timestamp":"2026-11-19T00:00:25Z", "event":"DockingRequested", "MarketID":3223689472, "StationName":"Harper Plant", "StationType":"Orbis", "LandingPads":{ "Small":6, "Medium":12, "Large":5 } }
export type DockingRequestedEvent = JournalEvent & {
    MarketID: number,
    StationName: string,
    StationType: string,
    LandingPads: {
        Small: number,
        Medium: number,
        Large: number,
    }
}
export const DockingRequestedEvent = {
    constructor: (raw: DockingRequestedEvent) => {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.DockingRequested, raw).finally();
    }
}


// { "timestamp":"2026-11-19T00:00:26Z", "event":"DockingGranted", "LandingPad":32, "MarketID":3223689472, "StationName":"Harper Plant", "StationType":"Orbis" }
export type DockingGrantedEvent = JournalEvent & {
    LandingPad: number,
    MarketID: number,
    StationName: string,
    StationType: string,
}
export const DockingGrantedEvent = {
    constructor: (raw: DockingGrantedEvent) => {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.DockingGranted, raw).finally();
    }
}


// { "timestamp":"2026-11-19T00:01:27Z", "event":"DockingDenied", "Reason":"Distance", "MarketID":3223689472, "StationName":"Harper Plant", "StationType":"Orbis" }
export type DockingDeniedEvent = JournalEvent & {
    Reason: string,
    MarketID: number,
    StationName: string,
    StationType: string,
}
export const DockingDeniedEvent = {
    constructor: (raw: DockingDeniedEvent) => {
        DockingDeniedReasonVariable.setVariable(raw.Reason);
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.DockingDenied, raw).finally();
    }
}


// { "timestamp":"2026-11-19T00:01:14Z", "event":"DockingCancelled", "MarketID":3223689472, "StationName":"Harper Plant", "StationType":"Orbis" }
export type DockingCancelledEvent = JournalEvent & {
    MarketID: number,
    StationName: string,
    StationType: string,
}
export const DockingCancelledEvent = {
    constructor: (raw: DockingCancelledEvent) => {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.DockingCancelled, raw).finally();
    }
}

// { "timestamp":"2024-10-21T09:15:58Z", "event":"DockingTimeout", "MarketID":3225166080, "StationName":"Mooz Orbital", "StationType":"Coriolis" }
export type DockingTimeoutEvent = JournalEvent & {
    MarketID: number,
    StationName: string,
    StationType: string,
}
export const DockingTimeoutEvent = {
    constructor: (raw: DockingTimeoutEvent) => {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.DockingTimeout, raw).finally();
    }
}