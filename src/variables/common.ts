import { ReplaceVariable} from "@crowbartools/firebot-types";
import {EVENT_SOURCE_ID, VARIABLE_PREFIX} from "../constants";
import {FirebotFSDJumpEvent, FirebotScreenshotEvent} from "../events/travel";
import {JournalEventType} from "../journal-events";
import {FSDJumpEvent} from "../journal-events/travel";
import {FirebotLocationEvent, FirebotWingAddEvent} from "../events/common";
import {WingAddEvent} from "../journal-events/common";

export class CommanderNameVariable {
    static value: string;

    public static getVariable(): ReplaceVariable {
        return {
            definition: {
                handle: `${VARIABLE_PREFIX}CommanderName`,
                description: "The name of the commander.",
                possibleDataOutput: ["text"],
                categories: ["integrations"],
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

export class SystemNameVariable {
    static value: string;

    public static getVariable(): ReplaceVariable {
        return {
            definition: {
                handle: `${VARIABLE_PREFIX}SystemName`,
                description: "The name of the last known system.",
                possibleDataOutput: ["text"],
                categories: ["integrations", "trigger based"],
                // triggers: {
                //     event: [
                //         `${EVENT_SOURCE_ID}:${FirebotFSDJumpEvent.id}`,
                //         `${EVENT_SOURCE_ID}:${FirebotLocationEvent.id}`,
                //     ],
                //     command: true,
                //     control_deck: true,
                //     api: true,
                //     channel_reward: true,
                //     counter: true,
                //     custom_script: true,
                //     hotkey: true,
                //     overlay_widget: true,
                //     power_up: true,
                //     preset: true,
                //     quick_action: true,
                //     scheduled_task: true,
                //     startup_script: false,
                //     timer: true,
                //     manual: true
                // }
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

export class DockedVariable {
    static value: boolean;

    public static getVariable(): ReplaceVariable {
        return {
            definition: {
                handle: `${VARIABLE_PREFIX}Docked`,
                description: "The name of the last known system.",
                possibleDataOutput: ["bool"],
                categories: ["integrations"],
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

export class ScreenshotFilenameVariable {
    static value: string;

    public static getVariable(): ReplaceVariable {
        return {
            definition: {
                handle: `${VARIABLE_PREFIX}ScreenshotFilename`,
                description: `Filename of the high-res screenshot.<br>Filename example: '\\ED_Pictures\\HighResScreenShot_2026-11-19_22-09-25.bmp'`,
                possibleDataOutput: ["text"],
                categories: ["trigger based"],
                triggers: {
                    event: [
                        `${EVENT_SOURCE_ID}:${FirebotScreenshotEvent.id}`
                    ]
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

export class WingMemberVariable {
    static value: string;

    public static getVariable(): ReplaceVariable {
        return {
            definition: {
                handle: `${VARIABLE_PREFIX}${this.name.replaceAll('Variable', '')}`,
                description: "Wing member's name",
                possibleDataOutput: ["text"],
                categories: ["trigger based"],
                triggers: {
                    event: [
                        `${EVENT_SOURCE_ID}:${FirebotWingAddEvent.id}`
                    ]
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

