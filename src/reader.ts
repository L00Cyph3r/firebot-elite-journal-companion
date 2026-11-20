import fs from "fs";
import path from "path";
import firebot from "@crowbartools/firebot-types";
import {FSWatcher, PathLike} from "node:fs";
import * as readline from "node:readline";
import {JournalEvent, JournalEventType} from "./journal-events";
import {CommanderNameVariable} from "./variables/common";
import {CommanderEvent} from "./journal-events/startup";
import {
    ApproachBodyEvent,
    ApproachSettlementEvent,
    DisembarkEvent,
    DockedEvent,
    DockSRVEvent,
    EmbarkEvent,
    FSDJumpEvent,
    LaunchSRVEvent, LaunchVesselEvent,
    LeaveBodyEvent,
    LiftoffEvent,
    LocationEvent,
    StartJumpEvent,
    SupercruiseExitEvent,
    TouchdownEvent,
    UndockedEvent
} from "./journal-events/travel";
import {
    CommitCrimeEvent,
    DiedEvent,
    HeatDamageEvent,
    HeatWarningEvent,
    InterdictedEvent,
    InterdictionEvent,
    ShieldStateEvent
} from "./journal-events/combat";
import {
    DockingCancelledEvent,
    DockingDeniedEvent,
    DockingGrantedEvent,
    DockingRequestedEvent,
    DockingTimeoutEvent
} from "./journal-events/station-service";
import {
    ScreenshotEvent,
    SelfDestructEvent,
    WingAddEvent,
    WingInviteEvent,
    WingJoinEvent,
    WingLeaveEvent
} from "./journal-events/common";

export class JournalReader {
    private readonly journalDirectory: PathLike;
    // @ts-ignore path is set in constructor
    private currentJournalPath: PathLike;
    private currentJournalOffset: number = 0;
    public static isLive: boolean = false;
    private pollTimer: any | undefined;
    private watcher: FSWatcher | undefined;
    private isReading: boolean = false;
    private queuedRead: boolean = false;
    private debounceTimer: any | undefined;
    private readonly pollIntervalMs: number;

    constructor(journalDirectory: string, pollIntervalMs: number = 10000) {
        this.journalDirectory = journalDirectory;
        this.pollIntervalMs = pollIntervalMs;
        let maybeJournal = this.getLatestJournalFile();
        if (!maybeJournal) {
            firebot.logger.warn('No journal file found in directory');
            return;
        }
        this.currentJournalPath = maybeJournal;
        this.setActiveJournalFile(maybeJournal);
    }

    public async start(): Promise<void> {
        try {
            await this.processCurrentStream();
            JournalReader.isLive = true;
            firebot.logger.info(`Read the initial journal until: ${this.currentJournalOffset} bytes`);
        } catch (err) {
            firebot.logger.error(`Error processing initial journal stream: ${err}`);
        } finally {
            this.startWatcher();
            this.startPollingForJournals(async () => {
                this.startWatcher();
                await this.processCurrentStream();
            });
        }
    }

    // Don't ask me why it works, it just does. One day I'll make it less convoluted.
    private startWatcher() {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = undefined;
        }
        if (!this.currentJournalPath) {
            return;
        }
        firebot.logger.info(`Starting watcher for journal file: ${this.currentJournalPath.toString()}`);
        try {
            this.watcher = fs.watch(this.currentJournalPath.toString(), {
                persistent: true,
            }, (eventType, filename) => {
                firebot.logger.debug(`Watch event: ${eventType} - ${filename ?? 'unknown'}`);
                if (this.debounceTimer) {
                    clearTimeout(this.debounceTimer);
                }
                this.debounceTimer = setTimeout(() => {
                    this.processCurrentStream().catch((err) => {
                        firebot.logger.error(`Error processing journal stream: ${err}`);
                    });
                }, 100);
            });
            this.watcher.on('error', (err) => {
                firebot.logger.error(`Watcher error for journal file: ${err}`);
            });
        } catch (err) {
            firebot.logger.error(`Failed to start watcher for journal file: ${err}`);
        }
    }

    private async processCurrentStream(): Promise<void> {
        if (!this.currentJournalPath) {
            firebot.logger.warn('No journal path available');
            return;
        }

        if (this.isReading) {
            this.queuedRead = true;
            return;
        }

        this.isReading = true;

        try {
            do {
                this.queuedRead = false;
                if (!this.currentJournalPath || !fs.existsSync(this.currentJournalPath)) {
                    break;
                }

                const stat = fs.statSync(this.currentJournalPath);
                const fileSize = stat.size;

                if (this.currentJournalOffset === undefined || this.currentJournalOffset < 0) {
                    this.currentJournalOffset = 0;
                }

                if (fileSize < this.currentJournalOffset) {
                    firebot.logger.warn(`Journal file size (${fileSize}) is less than current offset (${this.currentJournalOffset}). Resetting offset.`);
                    this.currentJournalOffset = 0;
                }

                if (fileSize === this.currentJournalOffset) {
                    break;
                }

                const startOffset = this.currentJournalOffset;
                const stream = fs.createReadStream(this.currentJournalPath, {
                    start: startOffset,
                    autoClose: true,
                    encoding: 'utf8'
                });

                const rl = readline.createInterface({
                    input: stream,
                    terminal: false,
                    crlfDelay: Infinity
                });

                for await (const line of rl) {
                    JournalReader.processLine(line);
                }

                this.currentJournalOffset = startOffset + stream.bytesRead;
                firebot.logger.info(`Journal cursor: ${this.currentJournalOffset}`);
                firebot.logger.info('Journal processing completed');
            } while (this.queuedRead);
        } catch (err) {
            firebot.logger.error(`Error processing journal stream: ${err}`);
        } finally {
            this.isReading = false;
        }
    }

    private getLatestJournalFile(): PathLike | undefined {
        let files = this.getJournalFiles();
        if (files.length === 0) {
            return undefined;
        }
        return files[files.length - 1];
    }

    /**
     * Open the specified journal file and closes the current journal file if it exists.
     * @param journalFile
     * @private
     */
    private setActiveJournalFile(journalFile: PathLike) {
        this.watcher?.close();
        this.watcher = undefined;
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = undefined;
        }
        firebot.logger.info(`Switching to new journal file: ${journalFile}`);
        this.currentJournalPath = journalFile;
        this.currentJournalOffset = 0;
    }

    private startPollingForJournals(callback: () => void | Promise<void>) {
        this.pollTimer = setInterval(async () => {
            let latestJournalFile = this.getLatestJournalFile();
            if (latestJournalFile && latestJournalFile.toString() !== this.currentJournalPath?.toString()) {
                firebot.logger.info(`New journal file detected: ${latestJournalFile}, switching to new journal file`);
                this.setActiveJournalFile(latestJournalFile);
                await callback();
            }
        }, this.pollIntervalMs);
    }

    public stop() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = undefined;
        }
        this.watcher?.close();
        this.watcher = undefined;
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = undefined;
        }
        this.isReading = false;
        this.queuedRead = false;
        JournalReader.isLive = false;
    }

    public getJournalFiles(): string[] {
        if (!this.journalDirectory) {
            firebot.logger.warn('Journal directory not set');
            return [];
        }
        try {
            let files = fs.readdirSync(this.journalDirectory);
            let journalFiles: string[] = [];

            files.forEach((file) => {
                if (file.endsWith('.log') && file.startsWith('Journal.')) {
                    journalFiles.push(path.join(this.journalDirectory.toString(), file));
                }
            });
            journalFiles.sort((a, b) => {
                return a.localeCompare(b);
            });
            return journalFiles;
        } catch (error) {
            firebot.logger.error(`Error reading journal files: ${error}`);
            return [];
        }
    }

    private static processLine(line: string): void {
        if (!line || !line.trim()) {
            return;
        }
        try {
            let data: JournalEvent = JSON.parse(line);
            switch (data.event) {
                case JournalEventType.AfmuRepairs:
                    break;
                case JournalEventType.AppliedToSquadron:
                    break;
                case JournalEventType.ApproachBody:
                    ApproachBodyEvent.constructor(<ApproachBodyEvent>data);
                    break;
                case JournalEventType.ApproachSettlement:
                    ApproachSettlementEvent.constructor(<ApproachSettlementEvent>data);
                    break;
                case JournalEventType.Backpack:
                    break;
                case JournalEventType.BackpackChange:
                    break;
                case JournalEventType.BookDropship:
                    break;
                case JournalEventType.BookTaxi:
                    break;
                case JournalEventType.Bounty:
                    break;
                case JournalEventType.BuyAmmo:
                    break;
                case JournalEventType.BuyDrones:
                    break;
                case JournalEventType.BuyExplorationData:
                    break;
                case JournalEventType.BuyMicroResources:
                    break;
                case JournalEventType.BuySuit:
                    break;
                case JournalEventType.BuyTradeData:
                    break;
                case JournalEventType.BuyWeapon:
                    break;
                case JournalEventType.CancelDropship:
                    break;
                case JournalEventType.CancelTaxi:
                    break;
                case JournalEventType.Cargo:
                    break;
                case JournalEventType.CargoDepot:
                    break;
                case JournalEventType.CargoTransfer:
                    break;
                case JournalEventType.CarrierBankTransfer:
                    break;
                case JournalEventType.CarrierBuy:
                    break;
                case JournalEventType.CarrierCrewServices:
                    break;
                case JournalEventType.CarrierDepositFuel:
                    break;
                case JournalEventType.CarrierDockingPermission:
                    break;
                case JournalEventType.CarrierFinance:
                    break;
                case JournalEventType.CarrierJumpCancelled:
                    break;
                case JournalEventType.CarrierJump:
                    break;
                case JournalEventType.CarrierJumpRequest:
                    break;
                case JournalEventType.CarrierLocation:
                    break;
                case JournalEventType.CarrierStats:
                    break;
                case JournalEventType.CarrierTradeOrder:
                    break;
                case JournalEventType.ChangeCrewRole:
                    break;
                case JournalEventType.ClearImpound:
                    break;
                case JournalEventType.CockpitBreached:
                    break;
                case JournalEventType.CodexEntry:
                    break;
                case JournalEventType.CollectCargo:
                    break;
                case JournalEventType.CollectItems:
                    break;
                case JournalEventType.ColonisationConstructionDepot:
                    break;
                case JournalEventType.ColonisationContribution:
                    break;
                case JournalEventType.Commander:
                    CommanderNameVariable.setVariable((<CommanderEvent>data).Name);
                    break;
                case JournalEventType.CommitCrime:
                    CommitCrimeEvent.constructor(<CommitCrimeEvent>data);
                    break;
                case JournalEventType.CommunityGoal:
                    break;
                case JournalEventType.CommunityGoalJoin:
                    break;
                case JournalEventType.CreateSuitLoadout:
                    break;
                case JournalEventType.CrewAssign:
                    break;
                case JournalEventType.CrewFire:
                    break;
                case JournalEventType.CrewHire:
                    break;
                case JournalEventType.CrewLaunchFighter:
                    break;
                case JournalEventType.CrewMemberJoins:
                    break;
                case JournalEventType.CrewMemberQuits:
                    break;
                case JournalEventType.CrewMemberRoleChange:
                    break;
                case JournalEventType.CrimeVictim:
                    break;
                case JournalEventType.DatalinkScan:
                    break;
                case JournalEventType.DatalinkVoucher:
                    break;
                case JournalEventType.DataScanned:
                    break;
                case JournalEventType.Died:
                    DiedEvent.constructor(<DiedEvent>data);
                    break;
                case JournalEventType.DiscoveryScan:
                    break;
                case JournalEventType.Disembark:
                    DisembarkEvent.constructor(<DisembarkEvent>data);
                    break;
                case JournalEventType.Docked:
                    DockedEvent.constructor(<DockedEvent>data);
                    break;
                case JournalEventType.DockFighter:
                    break;
                case JournalEventType.DockingCancelled:
                    DockingCancelledEvent.constructor(<DockingCancelledEvent>data);
                    break;
                case JournalEventType.DockingDenied:
                    DockingDeniedEvent.constructor(<DockingDeniedEvent>data);
                    break;
                case JournalEventType.DockingGranted:
                    DockingGrantedEvent.constructor(<DockingGrantedEvent>data);
                    break;
                case JournalEventType.DockingRequested:
                    DockingRequestedEvent.constructor(<DockingRequestedEvent>data);
                    break;
                case JournalEventType.DockingTimeout:
                    DockingTimeoutEvent.constructor(<DockingTimeoutEvent>data);
                    break;
                case JournalEventType.DockSRV:
                    DockSRVEvent.constructor(<DockSRVEvent>data);
                    break;
                case JournalEventType.DropshipDeploy:
                    break;
                case JournalEventType.EjectCargo:
                    break;
                case JournalEventType.Embark:
                    EmbarkEvent.constructor(<EmbarkEvent>data);
                    break;
                case JournalEventType.EndCrewSession:
                    break;
                case JournalEventType.EngineerContribution:
                    break;
                case JournalEventType.EngineerCraft:
                    break;
                case JournalEventType.EngineerProgress:
                    break;
                case JournalEventType.EscapeInterdiction:
                    break;
                case JournalEventType.FactionKillBond:
                    break;
                case JournalEventType.FCMaterials:
                    break;
                case JournalEventType.FetchRemoteModule:
                    break;
                case JournalEventType.FighterDestroyed:
                    break;
                case JournalEventType.FighterRebuilt:
                    break;
                case JournalEventType.Fileheader:
                    break;
                case JournalEventType.Friends:
                    break;
                case JournalEventType.Location:
                    LocationEvent.constructor(<LocationEvent>data);
                    break;
                case JournalEventType.MarketBuy:
                    break;
                case JournalEventType.MarketID:
                    break;
                case JournalEventType.Market:
                    break;
                case JournalEventType.MarketSell:
                    break;
                case JournalEventType.MaterialCollected:
                    break;
                case JournalEventType.MaterialDiscovered:
                    break;
                case JournalEventType.Materials:
                    break;
                case JournalEventType.MaterialTrade:
                    break;
                case JournalEventType.MiningRefined:
                    break;
                case JournalEventType.MissionAbandoned:
                    break;
                case JournalEventType.MissionAccepted:
                    break;
                case JournalEventType.MissionCompleted:
                    break;
                case JournalEventType.MissionFailed:
                    break;
                case JournalEventType.MissionRedirected:
                    break;
                case JournalEventType.Missions:
                    break;
                case JournalEventType.ModuleBuy:
                    break;
                case JournalEventType.ModuleInfo:
                    break;
                case JournalEventType.ModuleRetrieve:
                    break;
                case JournalEventType.ModuleSell:
                    break;
                case JournalEventType.ModuleSellRemote:
                    break;
                case JournalEventType.ModuleStore:
                    break;
                case JournalEventType.ModuleSwap:
                    break;
                case JournalEventType.MultiSellExplorationData:
                    break;
                case JournalEventType.Music:
                    break;
                case JournalEventType.NavBeaconScan:
                    break;
                case JournalEventType.NavRouteClear:
                    break;
                case JournalEventType.NavRoute:
                    break;
                case JournalEventType.NpcCrewPaidWage:
                    break;
                case JournalEventType.NpcCrewRank:
                    break;
                case JournalEventType.Outfitting:
                    break;
                case JournalEventType.PayBounties:
                    break;
                case JournalEventType.PayFines:
                    break;
                case JournalEventType.PowerplayCollect:
                    break;
                case JournalEventType.PowerplayDeliver:
                    break;
                case JournalEventType.PowerplayJoin:
                    break;
                case JournalEventType.PowerplayLeave:
                    break;
                case JournalEventType.PowerplayMerits:
                    break;
                case JournalEventType.Powerplay:
                    break;
                case JournalEventType.PowerplayRank:
                    break;
                case JournalEventType.PowerplaySalary:
                    break;
                case JournalEventType.Progress:
                    break;
                case JournalEventType.Promotion:
                    break;
                case JournalEventType.ProspectedAsteroid:
                    break;
                case JournalEventType.PVPKill:
                    break;
                case JournalEventType.QuitACrew:
                    break;
                case JournalEventType.Rank:
                    break;
                case JournalEventType.RebootRepair:
                    break;
                case JournalEventType.ReceiveText:
                    break;
                case JournalEventType.RedeemVoucher:
                    break;
                case JournalEventType.RefuelAll:
                    break;
                case JournalEventType.RefuelPartial:
                    break;
                case JournalEventType.RepairAll:
                    break;
                case JournalEventType.RepairDrone:
                    break;
                case JournalEventType.Repair:
                    break;
                case JournalEventType.Reputation:
                    break;
                case JournalEventType.ReservoirReplenished:
                    break;
                case JournalEventType.RestockVehicle:
                    break;
                case JournalEventType.Resurrect:
                    break;
                case JournalEventType.SAAScanComplete:
                    break;
                case JournalEventType.SAASignalsFound:
                    break;
                case JournalEventType.ScanBaryCentre:
                    break;
                case JournalEventType.Scanned:
                    break;
                case JournalEventType.ScanOrganic:
                    break;
                case JournalEventType.Scan:
                    break;
                case JournalEventType.Screenshot:
                    ScreenshotEvent.constructor(<ScreenshotEvent>data);
                    break;
                case JournalEventType.SearchAndRescue:
                    break;
                case JournalEventType.SelfDestruct:
                    SelfDestructEvent.constructor(<SelfDestructEvent>data);
                    break;
                case JournalEventType.SellDrones:
                    break;
                case JournalEventType.SellOrganicData:
                    break;
                case JournalEventType.SellSuit:
                    break;
                case JournalEventType.SellWeapon:
                    break;
                case JournalEventType.SendText:
                    break;
                case JournalEventType.SetUserShipName:
                    break;
                case JournalEventType.StartJump:
                    StartJumpEvent.constructor(<StartJumpEvent>data);
                    break;
                case JournalEventType.Statistics:
                    break;
                case JournalEventType.StoredModules:
                    break;
                case JournalEventType.StoredShips:
                    break;
                case JournalEventType.SuitLoadout:
                    break;
                case JournalEventType.SupercruiseDestinationDrop:
                    break;
                case JournalEventType.SupercruiseEntry:
                    break;
                case JournalEventType.SupercruiseExit:
                    SupercruiseExitEvent.constructor(<SupercruiseExitEvent>data);
                    break;
                case JournalEventType.SwitchSuitLoadout:
                    break;
                case JournalEventType.Synthesis:
                    break;
                case JournalEventType.SystemsShutdown:
                    break;
                case JournalEventType.TechnologyBroker:
                    break;
                case JournalEventType.Touchdown:
                    TouchdownEvent.constructor(<TouchdownEvent>data);
                    break;
                case JournalEventType.UnderAttack:
                    break;
                case JournalEventType.Undocked:
                    UndockedEvent.constructor(<UndockedEvent>data);
                    break;
                case JournalEventType.UseConsumable:
                    break;
                case JournalEventType.USSDrop:
                    break;
                case JournalEventType.VehicleSwitch:
                    break;
                case JournalEventType.WingAdd:
                    WingAddEvent.constructor(<WingAddEvent>data);
                    break;
                case JournalEventType.WingInvite:
                    WingInviteEvent.constructor(<WingInviteEvent>data);
                    break;
                case JournalEventType.WingJoin:
                    WingJoinEvent.constructor(<WingJoinEvent>data);
                    break;
                case JournalEventType.WingLeave:
                    WingLeaveEvent.constructor(<WingLeaveEvent>data);
                    break;
                case JournalEventType.FSDJump:
                    FSDJumpEvent.constructor(<FSDJumpEvent>data);
                    break;
                case JournalEventType.FSDTarget:
                    break;
                case JournalEventType.FSSAllBodiesFound:
                    break;
                case JournalEventType.FSSBodySignals:
                    break;
                case JournalEventType.FSSDiscoveryScan:
                    break;
                case JournalEventType.FSSSignalDiscovered:
                    break;
                case JournalEventType.FuelScoop:
                    break;
                case JournalEventType.GameModeChange:
                    break;
                case JournalEventType.HeatWarning:
                    HeatWarningEvent.constructor(<HeatWarningEvent>data);
                    break;
                case JournalEventType.HullDamage:
                    break;
                case JournalEventType.Innocent:
                    break;
                case JournalEventType.Interdicted:
                    InterdictedEvent.constructor(<InterdictedEvent>data);
                    break;
                case JournalEventType.HeatDamage:
                    HeatDamageEvent.constructor(<HeatDamageEvent>data);
                    break;
                case JournalEventType.ShieldState:
                    ShieldStateEvent.constructor(<ShieldStateEvent>data);
                    break;
                case JournalEventType.ShipLocker:
                    break;
                case JournalEventType.ShipRedeemed:
                    break;
                case JournalEventType.ShipTargeted:
                    break;
                case JournalEventType.ShipyardBuy:
                    break;
                case JournalEventType.ShipyardNew:
                    break;
                case JournalEventType.ShipyardRedeem:
                    break;
                case JournalEventType.ShipyardSell:
                    break;
                case JournalEventType.Shipyard:
                    break;
                case JournalEventType.ShipyardSwap:
                    break;
                case JournalEventType.ShipyardTransfer:
                    break;
                case JournalEventType.Shutdown:
                    break;
                case JournalEventType.SquadronStartup:
                    break;
                case JournalEventType.Interdiction:
                    InterdictionEvent.constructor(<InterdictionEvent>data);
                    break;
                case JournalEventType.JetConeBoost:
                    break;
                case JournalEventType.JoinACrew:
                    break;
                case JournalEventType.JoinedSquadron:
                    break;
                case JournalEventType.LaunchDrone:
                    break;
                case JournalEventType.LaunchFighter:
                    break;
                case JournalEventType.LaunchSRV:
                    LaunchSRVEvent.constructor(<LaunchSRVEvent>data);
                    break;
                case JournalEventType.LaunchVessel:
                    LaunchVesselEvent.constructor(<LaunchVesselEvent>data);
                    break;
                case JournalEventType.LeaveBody:
                    LeaveBodyEvent.constructor(<LeaveBodyEvent>data);
                    break;
                case JournalEventType.Liftoff:
                    LiftoffEvent.constructor(<LiftoffEvent>data);
                    break;
                case JournalEventType.LoadGame:
                    break;
                case JournalEventType.LoadoutEquipModule:
                    break;
                case JournalEventType.Loadout:
                    break;

                default:
                    // Event not handled
                    firebot.logger.warn(`Event not handled: ${data.event}`);
                    break;
            }
        } catch (error) {
            firebot.logger.error(`Error parsing journal line: ${error}`);
        }
    }
}