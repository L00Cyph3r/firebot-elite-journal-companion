import { ReplaceVariable} from "@crowbartools/firebot-types";
import {EVENT_SOURCE_ID, VARIABLE_PREFIX} from "../constants";
import {FirebotFSDJumpEvent, FirebotStartJumpEvent} from "../events/travel";
import {StartJumpEvent} from "../journal-events/travel";

export class CurrentJumpSystemNameVariable {
    static value: string;

    public static getVariable(): ReplaceVariable {
        return {
            definition: {
                handle: `${VARIABLE_PREFIX}CurrentJumpSystemName`,
                description: "The name of the system the ship is currently jumping to.",
                possibleDataOutput: ["text"],
                categories: ["integrations", "trigger based"],
                triggers: {
                    event: [
                        `${EVENT_SOURCE_ID}:${FirebotStartJumpEvent.id}`,
                    ],
                    manual: true
                }
            },
            evaluator: async (trigger) => {
                let triggerData = (trigger.metadata?.eventData as StartJumpEvent).StarSystem;
                if (triggerData) {
                    this.value = triggerData;
                }
                return this.value;
            }
        }
    }

    public static setVariable(newValue: string) {
        this.value = newValue;
    }
}

export class CurrentJumpSystemStarClassVariable {
    static value: string;

    public static getVariable(): ReplaceVariable {
        return {
            definition: {
                handle: `${VARIABLE_PREFIX}${this.name.replaceAll('Variable', '')}`,
                description: "The star class of the system the ship is currently jumping to.",
                possibleDataOutput: ["text"],
                categories: ["integrations", "trigger based"],
                triggers: {
                    event: [
                        `${EVENT_SOURCE_ID}:${FirebotStartJumpEvent.id}`,
                    ],
                }
            },
            evaluator: async (trigger) => {
                let triggerData = (trigger.metadata?.eventData as StartJumpEvent).StarClass;
                if (triggerData) {
                    this.value = triggerData;
                }
                return this.value;
            }
        }
    }

    public static setVariable(newValue: string) {
        this.value = newValue;
    }
}
