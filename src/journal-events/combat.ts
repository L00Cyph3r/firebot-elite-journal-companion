import {JournalEvent, JournalEventType} from "./index";
import {FirebotHeatDamageEvent} from "../events/combat";
import firebot from "@crowbartools/firebot-types";
import {EVENT_SOURCE_ID} from "../constants";
import {JournalReader} from "../reader";
import {CommittedCrimeTypeVariable, KilledByVariable, ShieldStateVariable} from "../variables/combat";

// { "timestamp":"2026-10-24T00:47:50Z", "event":"HeatDamage" }
export type HeatDamageEvent = JournalEvent;
export const HeatDamageEvent = {
    constructor(_: HeatDamageEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.HeatDamage).finally();
    }
}

// { "timestamp":"2026-10-24T00:47:42Z", "event":"HeatWarning" }
export type HeatWarningEvent = JournalEvent;
export const HeatWarningEvent = {
    constructor(_: HeatWarningEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.HeatWarning).finally();
    }
}

// { "timestamp":"2026-11-18T17:52:30Z", "event":"ShieldState", "ShieldsUp":false }
export type ShieldStateEvent = JournalEvent & { ShieldsUp: boolean };
export const ShieldStateEvent = {
    constructor(event: ShieldStateEvent) {
        ShieldStateVariable.setVariable(event.ShieldsUp);
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.ShieldState, event).finally();
    }
}

// { "timestamp":"2026-10-24T00:47:28Z", "event":"Interdiction", "Success":true, "IsPlayer":true, "Interdicted":"Orange Pheonix", "CombatRank":8 }
export type InterdictionEvent = JournalEvent & {
    Success: boolean,
    IsPlayer: boolean,
    Interdicted: string,
    CombatRank: number
};
export const InterdictionEvent = {
    constructor(event: InterdictionEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Interdiction, event).finally();
    }
};

// { "timestamp":"2026-11-18T19:29:51Z", "event":"Interdicted", "Submitted":true, "Interdictor":"ARROW826", "IsPlayer":true, "CombatRank":6 }
export type InterdictedEvent = JournalEvent & {
    Submitted: boolean,
    Interdictor: string,
    IsPlayer: boolean,
    CombatRank: number
};
export const InterdictedEvent = {
    constructor(event: InterdictedEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Interdicted, event).finally();
    }
}


export type DiedEvent = JournalEvent & {
    KillerName: string | undefined,
    KillerShip: string | undefined,
    KillerRank: string | undefined,
    Killers: {
        Name: string,
        Ship: string,
        Rank: string
    }[] | undefined
};
export const DiedEvent = {
    constructor(event: DiedEvent) {
        let killedBy: string[] = [];
        if (event.Killers) {
            event.Killers.forEach(killer => {
                killedBy.push(killer.Name);
            });
        } else if (event.KillerName) {
            killedBy.push(event.KillerName);
        } else {
            killedBy.push("Unknown");
        }
        KilledByVariable.setVariable(killedBy);
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Died, event).finally();
    }
};

// {"timestamp":"2026-05-16T22:08:20Z", "event":"CommitCrime", "CrimeType":"dockingMajorBlockingLandingPad", "Faction":"Teaka Elite Altruists Bagging Cooperative", "Bounty":500 }
export type CommitCrimeEvent = JournalEvent & {
    CrimeType: string,
    Faction: string,
    Bounty: number
};
export const CommitCrimeEvent = {
    constructor(event: CommitCrimeEvent) {
        CommittedCrimeTypeVariable.setVariable(event.CrimeType);
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.CommitCrime, event).finally();
    }
};