import {ReplaceVariable} from "@crowbartools/firebot-types";
import {EVENT_SOURCE_ID, VARIABLE_PREFIX} from "../constants";
import {FirebotCommitCrimeEvent, FirebotDiedEvent, FirebotShieldStateEvent} from "../events/combat";

export class ShieldStateVariable {
    static value: boolean;

    public static getVariable(): ReplaceVariable {
        return {
            definition: {
                handle: `${VARIABLE_PREFIX}${this.name.replaceAll('Variable', '')}`,
                description: "Current state of shields.",
                possibleDataOutput: ["bool"],
                categories: ["integrations", "trigger based"],
                triggers: {
                    event: [
                        `${EVENT_SOURCE_ID}:${FirebotShieldStateEvent.id}`
                    ],
                },
            },

            evaluator: async () => {
                return this.value;
            }
        }
    }

    public static setVariable(newValue: boolean) {
        this.value = newValue;
    }
}

export class KilledByVariable {
    static value: string[];

    public static getVariable(): ReplaceVariable {
        return {
            definition: {
                handle: `${VARIABLE_PREFIX}${this.name.replaceAll('Variable', '')}`,
                description: "List of killers that killed you last. Or a single killer's name. Else it's 'Unknown'",
                possibleDataOutput: ["text"],
                categories: ["trigger based"],
                triggers: {
                    event: [
                        `${EVENT_SOURCE_ID}:${FirebotDiedEvent.id}`
                    ],
                },
            },
            evaluator: async () => {
                return this.value.join(", ");
            }
        }
    }

    public static setVariable(newValue: string[]) {
        this.value = newValue;
    }
}

export class CommittedCrimeTypeVariable {
    static value: string;

    public static getVariable(): ReplaceVariable {
        return {
            definition: {
                handle: `${VARIABLE_PREFIX}${this.name.replaceAll('Variable', '')}`,
                description: "Type of crime committed.",
                possibleDataOutput: ["text"],
                categories: ["integrations", "trigger based"],
                triggers: {
                    event: [
                        `${EVENT_SOURCE_ID}:${FirebotCommitCrimeEvent.id}`,
                    ],
                }
            },
            evaluator: async () => {
                return this.value;
            }
        }
    }

    public static setVariable(newValue: string) {
        this.value = newValue;
    }
}
