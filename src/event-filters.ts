import {EVENT_SOURCE_ID} from "./constants";
import {
    FirebotDisembarkEvent, FirebotDockedEvent,
    FirebotEmbarkEvent,
    FirebotFSDJumpEvent,
    FirebotLaunchSRVEvent, FirebotLaunchVesselEvent,
    FirebotLiftoffEvent,
    FirebotStartJumpEvent, FirebotSupercruiseEntryEvent, FirebotSupercruiseExitEvent,
    FirebotTouchdownEvent, FirebotUndockedEvent
} from "./events/travel";
import firebot, {EventData, EventFilter, Plugin} from "@crowbartools/firebot-types";
import {JournalEventType} from "./journal-events";
import {FirebotInterdictedEvent, FirebotInterdictionEvent, FirebotShieldStateEvent} from "./events/combat";

export class EventFilters {
    public static JumpTypeFilter: EventFilter = {
        id: "edjc:StarJump-JumpType",
        name: "Jump type",
        description: "Filter Jump Type",
        events: [
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotStartJumpEvent.id},
        ],
        comparisonTypes: ["equal", "not equal"],
        valueType: "preset",
        presetValues: async () => {
            return [
                {
                    value: "Hyperspace",
                    display: "Hyperspace"
                },
                {
                    value: "Supercruise",
                    display: "Supercruise"
                }
            ];
        },
        predicate: async (filterSettings, eventData: EventData) => {
            const {value} = filterSettings;
            return eventData.eventMeta.JumpType === value;
        }
    }
    public static InterdictionIsPlayerFilter: EventFilter = {
        id: `edjc:${JournalEventType.Interdiction}-IsPlayer`,
        name: "Is Player",
        description: "Wether we have interdicted a player or not",
        events: [
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotInterdictionEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotInterdictedEvent.id},
        ],
        comparisonTypes: ["equal", "not equal"],
        valueType: "preset",
        presetValues: async () => {
            return [
                {
                    value: true,
                    display: "True"
                },
                {
                    value: false,
                    display: "False"
                }
            ];
        },
        predicate: async (filterSettings, eventData: EventData) => {
            // {"eventSourceId":"elite-dangerous-journal-companion","eventId":"Interdiction","eventMeta":{"timestamp":"2026-11-18T18:35:34Z","event":"Interdiction","Success":true,"IsPlayer":false,"Faction":"United Ancate Democrats","username":"l00_cyph3r"}}
            firebot.logger.debug(`Interdiction event: ${JSON.stringify(eventData)}`);
            const {value} = filterSettings;
            return eventData.eventMeta.IsPlayer === value;
        }
    };
    public static InterdictionSuccessFilter: EventFilter = {
        id: `edjc:${JournalEventType.Interdiction}-Success`,
        name: "Successful",
        description: "Wether we have successfully completed the interdict interdiction",
        events: [
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotInterdictionEvent.id},
        ],
        comparisonTypes: ["equal", "not equal"],
        valueType: "preset",
        presetValues: async () => {
            return [
                {
                    value: true,
                    display: "True"
                },
                {
                    value: false,
                    display: "False"
                }
            ];
        },
        predicate: async (filterSettings, eventData: EventData) => {
            const {value} = filterSettings;
            return eventData.eventMeta.Success === value;
        }
    };
    public static IsTaxiFilter: EventFilter = {
        id: "edjc:IsTaxi",
        name: "Taxi",
        description: "If travelling via a Taxi",
        events: [
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotStartJumpEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotFSDJumpEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotSupercruiseEntryEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotSupercruiseExitEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotLiftoffEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotTouchdownEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotEmbarkEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotDisembarkEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotDockedEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotUndockedEvent.id},
        ],
        comparisonTypes: ["equal", "not equal"],
        valueType: "preset",
        presetValues: async () => {
            return [
                {
                    value: true,
                    display: "True"
                },
                {
                    value: false,
                    display: "False"
                }
            ];
        },
        predicate: async (filterSettings, eventData: EventData) => {
            const {value} = filterSettings;
            return eventData.eventMeta.Taxi === value;
        }
    }

    public static IsPlayerControlledFilter: EventFilter = {
        id: "edjc:IsPlayerControlled",
        name: "Player Controlled",
        description: "Was this event controlled by a player",
        events: [
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotTouchdownEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotLaunchVesselEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotLaunchSRVEvent.id},
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotLiftoffEvent.id},
        ],
        comparisonTypes: ["equal", "not equal"],
        valueType: "preset",
        presetValues: async () => {
            return [
                {
                    value: true,
                    display: "True"
                },
                {
                    value: false,
                    display: "False"
                }
            ];
        },
        predicate: async (filterSettings, eventData: EventData) => {
            const {value} = filterSettings;
            return eventData.eventMeta.PlayerControlled === value;
        }
    }
    public static ShieldStateFilter: EventFilter = {
        id: "edjc:ShieldState",
        name: "Shield State",
        description: "Wether the shields are active",
        events: [
            {eventSourceId: EVENT_SOURCE_ID, eventId: FirebotShieldStateEvent.id},
        ],
        comparisonTypes: ["equal", "not equal"],
        valueType: "preset",
        presetValues: async () => {
            return [
                {
                    value: true,
                    display: "True"
                },
                {
                    value: false,
                    display: "False"
                }
            ];
        },
        predicate: async (filterSettings, eventData: EventData) => {
            const {value} = filterSettings;
            return eventData.eventMeta.ShieldState === value;
        }
    }
}