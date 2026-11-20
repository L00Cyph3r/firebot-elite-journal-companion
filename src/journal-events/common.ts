import {JournalEvent, JournalEventType} from "./index";
import {
    CommanderNameVariable,
    ScreenshotFilenameVariable,
    SystemNameVariable,
    WingMemberVariable
} from "../variables/common";
import {JournalReader} from "../reader";
import firebot from "@crowbartools/firebot-types";
import {EVENT_SOURCE_ID} from "../constants";

// { "timestamp":"2026-10-23T23:04:23Z", "event":"Commander", "FID":"F7637318", "Name":"L00_Cyph3r" }
export type CommanderEvent = JournalEvent & {
    FID: string;
    Name: string;
}
export const CommanderEvent = {
    constructor(raw: CommanderEvent) {
        CommanderNameVariable.setVariable(raw.Name);
    }
}

// { "timestamp":"2026-10-23T23:04:32Z", "event":"Friends", "Status":"Online", "Name":"Heather G" }
export type FriendsEvent = JournalEvent & {
    Status: string;
    Name: string;
}
export const FriendsEvent = {
    constructor(raw: FriendsEvent) {
        // TODO: Implement
        // FirebotFriendEvent(raw);
    }
}

// { "timestamp":"2026-10-23T23:04:53Z", "event":"Missions", "Active":[ { "MissionID":1069243646, "Name":"Mission_MassacreWing_Legal_Military_name", "PassengerMission":false, "Expires":598726 } ], "Failed":[  ], "Complete":[  ] }
export type MissionsEvent = {
    Active: Mission[];
    Failed: Mission[];
    Complete: Mission[];
}

type Mission = {
    MissionID: number;
    Name: string;
    PassengerMission: boolean;
    Expires: number;
}

// { "timestamp":"2026-11-19T22:09:22Z", "event":"Screenshot", "Filename":"\\ED_Pictures\\HighResScreenShot_2026-11-19_22-09-25.bmp", "Width":10240, "Height":5760, "System":"Shinrarta Dezhra", "Body":"Jameson Memorial" }
export type ScreenshotEvent = JournalEvent & {
    Filename: string;
    Width: number;
    Height: number;
    System: string;
    Body: string;
}
export const ScreenshotEvent = {
    constructor(event: ScreenshotEvent) {
        ScreenshotFilenameVariable.setVariable(event.Filename);
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.Screenshot, event).finally();
    }
}

export type SelfDestructEvent = JournalEvent;
export const SelfDestructEvent = {
    constructor(event: SelfDestructEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.SelfDestruct, event).finally();
    }
}


// { "timestamp":"2025-04-09T20:57:25Z", "event":"WingAdd", "Name":"Orange Pheonix" }
export type WingAddEvent = JournalEvent & {
    Name: string;
}
export const WingAddEvent = {
    constructor(event: WingAddEvent) {
        WingMemberVariable.setVariable(event.Name);
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.WingAdd, event).finally();
    }
}

// { "timestamp":"2025-04-09T20:57:25Z", "event":"WingInvite", "Name":"Orange Pheonix" }
export type WingInviteEvent = JournalEvent & {
    Name: string;
}
export const WingInviteEvent = {
    constructor(event: WingInviteEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.WingInvite, event).finally();
    }
}
// { "timestamp":"2025-04-10T17:55:30Z", "event":"WingJoin", "Others":[ "Xenise", "Orange Pheonix" ] }
export type WingJoinEvent = JournalEvent & {
    Others: string[];
}
export const WingJoinEvent = {
    constructor(event: WingJoinEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.WingJoin, event).finally();
    }
}
// { "timestamp":"2025-04-10T17:55:30Z", "event":"WingLeave" }
export type WingLeaveEvent = JournalEvent;
export const WingLeaveEvent = {
    constructor(event: WingLeaveEvent) {
        if (JournalReader.isLive) firebot.events.trigger(EVENT_SOURCE_ID, JournalEventType.WingLeave, event).finally();
    }
}
/*

{
  "timestamp": "2026-11-20T00:25:53Z",
  "event": "Loadout",
  "Ship": "anacondamkii",
  "ShipID": 33,
  "ShipName": "Bonnie Blue",
  "ShipIdent": "1000",
  "ModulesValue": 291636195,
  "HullHealth": 1.000000,
  "UnladenMass": 2044.100098,
  "CargoCapacity": 224,
  "MaxJumpRange": 55.057186,
  "FuelCapacity": {
    "Main": 64.000000,
    "Reserve": 1.080000
  },
  "Rebuy": 14581809,
}
 */
export type LoadoutEvent = JournalEvent & {

}

