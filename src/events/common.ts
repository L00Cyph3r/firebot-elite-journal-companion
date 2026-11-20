import {EventDefinition} from "@crowbartools/firebot-types";
import {JournalEventType} from "../journal-events";
import {PLUGIN_SHORT_NAME} from "../constants";

export const FirebotLocationEvent: EventDefinition = {
    id: JournalEventType.Location,
    description: "Location update.",
    name: `${PLUGIN_SHORT_NAME}: Location`,
}

export const FirebotSelfDestructEvent: EventDefinition = {
    id: JournalEventType.SelfDestruct,
    description: "Self-destruct event.",
    name: `${PLUGIN_SHORT_NAME}: SelfDestruct`,
}

export const FirebotWingAddEvent: EventDefinition ={
    id: JournalEventType.WingAdd,
    description: "Wing add event.",
    name: `${PLUGIN_SHORT_NAME}: WingAdd`,
}

export const FirebotWingInviteEvent: EventDefinition = {
    id: JournalEventType.WingInvite,
    description: "Wing invite event.",
    name: `${PLUGIN_SHORT_NAME}: WingInvite`,
}
export const FirebotWingJoinEvent: EventDefinition = {
    id: JournalEventType.WingJoin,
    description: "Wing join event.",
    name: `${PLUGIN_SHORT_NAME}: WingJoin`,
}
export const FirebotWingLeaveEvent: EventDefinition = {
    id: JournalEventType.WingLeave,
    description: "Wing leave event.",
    name: `${PLUGIN_SHORT_NAME}: WingLeave`,
}