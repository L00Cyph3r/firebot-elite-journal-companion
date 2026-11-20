import {EventDefinition} from "@crowbartools/firebot-types";
import {JournalEventType} from "../journal-events";
import {PLUGIN_SHORT_NAME} from "../constants";


export const FirebotStartJumpEvent: EventDefinition = {
    id: JournalEventType.StartJump,
    description: "FSD Jump initiated. Triggers when countdown starts.",
    name: `${PLUGIN_SHORT_NAME}: FSD Jump Initiated`,
    manualMetadata: {
        StarSystem: "System name",
        StarClass: "Star class",
        JumpType: "Hyperspace",
        Taxi: false,
    }
}
export const FirebotFSDJumpEvent: EventDefinition = {
    id: JournalEventType.FSDJump,
    description: "FSD Jump completed.",
    name: `${PLUGIN_SHORT_NAME}: FSD Jump`,
}

export const FirebotSupercruiseEntryEvent: EventDefinition = {
    id: JournalEventType.SupercruiseEntry,
    description: "Supercruise entered.",
    name: `${PLUGIN_SHORT_NAME}: Supercruise Entry`,
}

export const FirebotSupercruiseExitEvent: EventDefinition = {
    id: JournalEventType.SupercruiseExit,
    description: "Supercruise exited.",
    name: `${PLUGIN_SHORT_NAME}: Supercruise Exit`,
}

export const FirebotApproachBodyEvent: EventDefinition = {
    id: JournalEventType.ApproachBody,
    description: "Approaching a body.",
    name: `${PLUGIN_SHORT_NAME}: Approach Body`,
}

export const FirebotApproachSettlementEvent: EventDefinition = {
    id: JournalEventType.ApproachSettlement,
    description: "Approaching a settlement.",
    name: `${PLUGIN_SHORT_NAME}: Approach Settlement`,
}

export const FirebotTouchdownEvent: EventDefinition = {
    id: JournalEventType.Touchdown,
    description: "Touchdown completed.",
    name: `${PLUGIN_SHORT_NAME}: Touchdown`,
}

export const FirebotDisembarkEvent: EventDefinition = {
    id: JournalEventType.Disembark,
    description: "Disembark completed.",
    name: `${PLUGIN_SHORT_NAME}: Disembark`,
}

export const FirebotEmbarkEvent: EventDefinition = {
    id: JournalEventType.Embark,
    description: "Embark completed.",
    name: `${PLUGIN_SHORT_NAME}: Embark`,
}


export const FirebotLaunchVesselEvent: EventDefinition = {
    id: JournalEventType.LaunchVessel,
    description: "Launch Vessel completed.",
    name: `${PLUGIN_SHORT_NAME}: Launch Vessel`,
}
export const FirebotLaunchSRVEvent: EventDefinition = {
    id: JournalEventType.LaunchSRV,
    description: "Launch SRV completed.",
    name: `${PLUGIN_SHORT_NAME}: Launch SRV`,
}

export const FirebotDockSRVEvent: EventDefinition = {
    id: JournalEventType.DockSRV,
    description: "Dock SRV completed.",
    name: `${PLUGIN_SHORT_NAME}: Dock SRV`,
}

export const FirebotLiftoffEvent: EventDefinition = {
    id: JournalEventType.Liftoff,
    description: "Liftoff completed.",
    name: `${PLUGIN_SHORT_NAME}: Liftoff`,
}

export const FirebotDockedEvent: EventDefinition = {
    id: JournalEventType.Docked,
    description: "Docked.",
    name: `${PLUGIN_SHORT_NAME}: Docked`,
}

export const FirebotUndockedEvent: EventDefinition = {
    id: JournalEventType.Undocked,
    description: "Undocked.",
    name: `${PLUGIN_SHORT_NAME}: Undocked`,
}

export const FirebotScreenshotEvent: EventDefinition = {
    id: JournalEventType.Screenshot,
    description: "Screenshot taken.",
    name: `${PLUGIN_SHORT_NAME}: Screenshot`,
}


