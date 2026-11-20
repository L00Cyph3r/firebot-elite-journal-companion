import {EventDefinition} from "@crowbartools/firebot-types";
import {JournalEventType} from "../journal-events";
import {PLUGIN_SHORT_NAME} from "../constants";

export const FirebotHeatDamageEvent: EventDefinition = {
    id: JournalEventType.HeatDamage,
    description: "Taking Heat Damage",
    name: `${PLUGIN_SHORT_NAME}: Heat Damage`
}

export const FirebotShieldStateEvent: EventDefinition = {
    id: JournalEventType.ShieldState,
    description: "Shield State",
    name: `${PLUGIN_SHORT_NAME}: Shield State`
}

export const FirebotInterdictionEvent: EventDefinition = {
    id: JournalEventType.Interdiction,
    description: "Interdiction",
    name: `${PLUGIN_SHORT_NAME}: Interdiction`
}
export const FirebotInterdictedEvent: EventDefinition = {
    id: JournalEventType.Interdicted,
    description: "Interdicted",
    name: `${PLUGIN_SHORT_NAME}: Interdicted`
}

export const FirebotDiedEvent: EventDefinition = {
    id: JournalEventType.Died,
    description: "Died",
    name: `${PLUGIN_SHORT_NAME}: Died`
}

export const FirebotCommitCrimeEvent: EventDefinition = {
    id: JournalEventType.CommitCrime,
    description: "Committed a crime",
    name: `${PLUGIN_SHORT_NAME}: Commit Crime`
}