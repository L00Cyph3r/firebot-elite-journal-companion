import firebot, {
    Plugin,
    TriggeredEvent,
    Notification,
    NotificationType,
    ReplaceVariable, EventFilter, EventData
} from "@crowbartools/firebot-types";
import ReplaceVariableManager from "@crowbartools/firebot-types"

import packageInfo from '../package.json';
import {PluginEventHandler} from "@crowbartools/firebot-types/types/plugin-api";
import fs from "fs";
import {
    CommanderNameVariable,
    ScreenshotFilenameVariable,
    SystemNameVariable,
    WingMemberVariable
} from "./variables/common";
import {JournalReader} from "./reader";
import {
    FirebotCommitCrimeEvent,
    FirebotDiedEvent,
    FirebotHeatDamageEvent,
    FirebotInterdictedEvent,
    FirebotInterdictionEvent,
    FirebotShieldStateEvent
} from "./events/combat";
import {
    FirebotApproachBodyEvent, FirebotApproachSettlementEvent, FirebotDisembarkEvent,
    FirebotDockedEvent, FirebotDockSRVEvent, FirebotEmbarkEvent,
    FirebotFSDJumpEvent,
    FirebotLaunchSRVEvent, FirebotLaunchVesselEvent,
    FirebotLiftoffEvent, FirebotScreenshotEvent,
    FirebotStartJumpEvent, FirebotSupercruiseEntryEvent, FirebotSupercruiseExitEvent, FirebotTouchdownEvent,
    FirebotUndockedEvent
} from "./events/travel";
import {CurrentJumpSystemNameVariable, CurrentJumpSystemStarClassVariable} from "./variables/travel";
import {EVENT_SOURCE_ID} from "./constants";
import {CommittedCrimeTypeVariable, KilledByVariable, ShieldStateVariable} from "./variables/combat";
import {JournalEventType} from "./journal-events";
import {InterdictionEvent} from "./journal-events/combat";
import {
    FirebotLocationEvent,
    FirebotSelfDestructEvent,
    FirebotWingAddEvent,
    FirebotWingInviteEvent, FirebotWingJoinEvent, FirebotWingLeaveEvent
} from "./events/common";
import {DockSRVEvent} from "./journal-events/travel";
import {
    FirebotDockingCancelledEvent,
    FirebotDockingDeniedEvent,
    FirebotDockingGrantedEvent,
    FirebotDockingRequestedEvent, FirebotDockingTimeoutEvent
} from "./events/station-service";
import {DockingDeniedReasonVariable} from "./variables/station-service";
import {EventFilters} from "./event-filters";
// const journalReader = new JournalReader();
type Params = {
    journalPath: string;
}
let journalReader: JournalReader | undefined;


const plugin: Plugin<Params> = {
    manifest: {
        icon: {
            type: "custom",
            url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAwFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8zMzPMzMwMDAwFBAQUFBQiIiL6+vrR0dHPz88sLCwbGxsWCABERETYVwDt7e0nJycwMDCJNwDf39+7u7vRUwDX19efn5/+/v7z8/Pl5eXHx8eqqqpra2x8fHxOTk9FGwArEQBzLQBfJgCUlJRbXF2Kioo5OTmrRQLsbRjBTwT/gCo8W39zAAAAE3RSTlMA99gFnuwLjCdbMrPBcz4Z0EzlrdN/+wAAA4RJREFUSMeNVul6okAQDJdGvNCBuVguQUBQBM94JPv+b7UDgyZRSLZ/8M1RRXUz3T28vDyZNOpqCsaK1h1JL/9hr7KCiEOpQ5Aiv/6OH2mIzo3K5hRpo1/fLyLbuJuNxF80On1AjS9GQb/zI6EnADp3EKHzOSXImVMg9H4UGACAENl6iBDkbQlCAAx+kpgIAIAgNs2ckNw044BNhckPBJkBcKozy/PymWK2ILfjxyLbtzPdhPHKj62lntlsQRy3h1y+0DP12LsUhXdZ66ZXSraGLZUelYQzRgFFzLeK0O7T67TcppGeeM5542wjPaLlyrTt8IagsrOeFYFtz88r/cxXhi0ha3ybnD33eDjs3NMb4StaY9hSLcDMvb7PZovQvS80SowUgur9/fvf98Vssa+nBCsNSTseINu5KXz8ZRLXWgHbFAyenJK6mBoBrhnH9/fZ4lhPkGEQ0JWe0tRh6c8JjuGGs1noUu4iKeviMWlZ3cxrAini9dY9hO42Tj3MCQbF3yupI+PA4IRLnplZfCJkG2dmsiGcYDhA7jw6VNYX8NYrXTeTdZ6vE1Nf+qkDSm1j/s0p7lAZm7c2y7T2LQgtvxqlhBdt8NWpbuWQEQCar/TK/CTx+SjbYP42B3RveHVKeIvAm0yvzTRvA8sDlb82nqp3AbvCg8v6Bvtifoo44y4xFgnHg020fCaY0APYqT56XXsTIWBNjn1RJ86e8foy2pTHzaIkdT/oIpufqQf9BoIe5WWWYxJQ7pPUx3WWFlYzIbZ5EiLQl+rmVZdaMyFZezdE1dTuBPxmRQ14M4HbbwSp/0lIGj7ryvokVC5V7a4inK2GqJcR/CTIX5sFwBsLPkswgfXlhuC1rSr1/MRS7vHoWAQwpjVAUevqFJSB3BdYZkAIs+Uj3mK5IfTlgSLc6rQzUjsvnYmIWBBMY/Xpv8/w0CqANmEAdfRwU6iak5aMP9nKZDJL04/KqfVGNLW59akizUsItJIoipI/sBqnVFRbLyAlSGFFuZkF3+i07Qrq9Fjg5JTG0KoNxumJAKXbrNCR3V0Y7tjV4J2KYrMpipMXILwLD/tp45XyqhxmrAVfD7u967LqcF13vztcF7PZx15uvtP34QfbZqSPcI/B7lrPrke31/ZX4u6OhzAMj+6gNxT3RzY8HHeuOGz5q5FGw76oCEAQu+OSP8VAULT+8FuT/AdDFpKgSf4ulgAAAABJRU5ErkJggg==",
        },
        name: "Elite Dangerous Journal Companion",
        description: packageInfo.description,
        author: packageInfo.author,
        version: packageInfo.version,
        repo: "https://github.com/L00Cyph3r/firebot-elite-journal-companion",
        minimumFirebotVersion: {major: 5, minor: 67},
        website: "https://github.com/L00Cyph3r/firebot-elite-journal-companion",
        support: "https://github.com/L00Cyph3r/firebot-elite-journal-companion/issues"
    },
    registers: {
        additionalFilterEvents: [
            {
                filterId: 'test',
                events: [
                    {
                        eventId: FirebotStartJumpEvent.id,
                        eventSourceId: EVENT_SOURCE_ID,
                    }
                ]
            }
        ],
        eventSources: [
            {
                description: "Elite Dangerous Journal Companion",
                events: [
                    // Common
                    FirebotScreenshotEvent,
                    FirebotLocationEvent,
                    FirebotDiedEvent,
                    FirebotSelfDestructEvent,
                    FirebotWingAddEvent,
                    FirebotWingInviteEvent,
                    FirebotWingJoinEvent,
                    FirebotWingLeaveEvent,
                    // Combat
                    FirebotCommitCrimeEvent,
                    FirebotHeatDamageEvent,
                    FirebotShieldStateEvent,
                    FirebotInterdictionEvent,
                    FirebotInterdictedEvent,
                    // Travel
                    FirebotStartJumpEvent,
                    FirebotFSDJumpEvent,
                    FirebotSupercruiseEntryEvent,
                    FirebotSupercruiseExitEvent,
                    FirebotApproachBodyEvent,
                    FirebotApproachSettlementEvent,
                    FirebotTouchdownEvent,
                    FirebotDisembarkEvent,
                    FirebotEmbarkEvent,
                    FirebotLaunchSRVEvent,
                    FirebotLaunchVesselEvent,
                    FirebotDockSRVEvent,
                    FirebotLiftoffEvent,
                    FirebotDockedEvent,
                    FirebotUndockedEvent,
                    // Station
                    FirebotDockingRequestedEvent,
                    FirebotDockingGrantedEvent,
                    FirebotDockingDeniedEvent,
                    FirebotDockingCancelledEvent,
                    FirebotDockingTimeoutEvent,
                ],

                id: "elite-dangerous-journal-companion",
                name: "Elite Dangerous Journal Companion"
            }
        ],
        filters: [
            EventFilters.JumpTypeFilter,
            EventFilters.IsTaxiFilter,
            EventFilters.InterdictionIsPlayerFilter,
            EventFilters.InterdictionSuccessFilter,
            EventFilters.IsPlayerControlledFilter,
            EventFilters.ShieldStateFilter,
        ],
        variables: [
            CommanderNameVariable.getVariable(),
            SystemNameVariable.getVariable(),
            CurrentJumpSystemNameVariable.getVariable(),
            CurrentJumpSystemStarClassVariable.getVariable(),
            ShieldStateVariable.getVariable(),
            KilledByVariable.getVariable(),
            DockingDeniedReasonVariable.getVariable(),
            CommittedCrimeTypeVariable.getVariable(),
            ScreenshotFilenameVariable.getVariable(),
            WingMemberVariable.getVariable(),
        ]
    },
    parametersSchema: [
        {
            name: "journalPath",
            title: "Elite: Dangerous Journal directory",
            description: "Directory of your Elite Dangerous Journal files",
            type: "filepath",
            fileOptions: {
                directoryOnly: true,
                filters: [],
                title: "Select Journal Directory",
                buttonLabel: "Choose Directory"
            },
            default: ""
        }
    ],
    onLoad: (context, isInstalling) => {
        firebot.logger.info('Elite Dangerous Journal Companion loaded');
        firebot.frontendCommunicator.send('edjc:journalPath', context.parameters.journalPath);

        let journalPath = context.parameters.journalPath;
        if (!journalPath) {
            firebot.notifications.add({
                title: 'EDJC Title',
                message: `Elite Dangerous Journal Companion doesn't have a journal directory set. Please configure it in the plugin settings.`,
                type: isInstalling ? "info" : "alert"
            }, false);
            return;
        } else if (!fs.existsSync(journalPath)) {
            firebot.notifications.add({
                title: 'EDJC Title',
                message: `Elite Dangerous Journal Companion directory doesn't exist. Please update it in the plugin settings.`,
                type: "alert"
            }, false);
            return;
        } else {
            // path is set, and exists
            firebot.logger.debug(`Journal path onLoad: ${journalPath}`);
            journalReader = new JournalReader(journalPath);
            journalReader.start().finally(() => {
                firebot.logger.info(`Journal reader started`);
            });
        }

    },
    onParameterUpdate: (context) => {
        let journalPath = context.parameters.journalPath;
        journalReader?.stop();
        journalReader = new JournalReader(journalPath);
        journalReader.start().finally(() => {
            firebot.logger.info(`Journal reader started`);
        });
        firebot.logger.info(`Journal path updated to: ${journalPath}`);
    },
    onUnload: (context) => {
        journalReader?.stop();
    }
}

const eventHandler: PluginEventHandler = (event: TriggeredEvent) => {
    if (event.event.id !== 'chat-message') {
        return;
    }

    let message = <string>event.meta.messageText;
    firebot.logger.info(`Message received: "${message}"`);
}


export default plugin;
