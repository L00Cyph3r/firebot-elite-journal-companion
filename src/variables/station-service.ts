import {ReplaceVariable} from "@crowbartools/firebot-types";
import {EVENT_SOURCE_ID, VARIABLE_PREFIX} from "../constants";
import {FirebotStartJumpEvent} from "../events/travel";
import {StartJumpEvent} from "../journal-events/travel";
import {DockingDeniedEvent} from "../journal-events/station-service";
import {FirebotDockingDeniedEvent} from "../events/station-service";

export class DockingDeniedReasonVariable {
    static value: string;

    public static getVariable(): ReplaceVariable {
        return {
            definition: {
                handle: `${VARIABLE_PREFIX}${this.name.replaceAll('Variable', '')}`,
                description: "The reason for docking denied.",
                possibleDataOutput: ["text"],
                categories: ["integrations", "trigger based"],
                triggers: {
                    event: [
                        `${EVENT_SOURCE_ID}:${FirebotDockingDeniedEvent.id}`,
                    ],
                }
            },
            evaluator: async (trigger) => {
                let triggerData = (trigger.metadata?.eventData as DockingDeniedEvent).Reason;
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
