import firebot, {EventDefinition} from "@crowbartools/firebot-types";
import {DockedEvent} from "../journal-events/travel";
import {EVENT_SOURCE_ID, PLUGIN_SHORT_NAME} from "../constants";
import {JournalEventType} from "../journal-events";
import {JournalReader} from "../reader";

export const FirebotDockingRequestedEvent: EventDefinition = {
    id: JournalEventType.DockingRequested,
    description: "Fired when docking is requested",
    name: `${PLUGIN_SHORT_NAME}: Docking Requested`,
}

export const FirebotDockingGrantedEvent: EventDefinition = {
    id: JournalEventType.DockingGranted,
    description: "Fired when docking is granted",
    name: `${PLUGIN_SHORT_NAME}: Docking Granted`,
}

export const FirebotDockingDeniedEvent: EventDefinition = {
    id: JournalEventType.DockingDenied,
    description: "Fired when docking is denied",
    name: `${PLUGIN_SHORT_NAME}: Docking Denied`,
}

export const FirebotDockingCancelledEvent: EventDefinition = {
    id: JournalEventType.DockingCancelled,
    description: "Fired when docking is cancelled",
    name: `${PLUGIN_SHORT_NAME}: Docking Cancelled`,
}
export const FirebotDockingTimeoutEvent: EventDefinition = {
    id: JournalEventType.DockingTimeout,
    description: "Fired when docking times out",
    name: `${PLUGIN_SHORT_NAME}: Docking Timeout`,
}