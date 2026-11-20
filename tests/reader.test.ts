import fs from "fs";
import path from "path";
import os from "os";
import firebot from "@crowbartools/firebot-types";
import { JournalReader } from "../src/reader";
import { CommanderNameVariable, SystemNameVariable } from "../src/variables/common";
import { EVENT_SOURCE_ID } from "../src/constants";
import { JournalEventType } from "../src/journal-events";

jest.mock("@crowbartools/firebot-types", () => ({
    __esModule: true,
    default: {
        logger: {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        },
        events: {
            trigger: jest.fn().mockResolvedValue(undefined),
        },
    },
}));

const mockedFirebot = firebot as unknown as {
    logger: {
        info: jest.Mock;
        warn: jest.Mock;
        error: jest.Mock;
    };
    events: {
        trigger: jest.Mock;
    };
};

describe("JournalReader", () => {
    let tempDir: string;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "edjc-test-"));
        jest.clearAllMocks();
        JournalReader.isLive = false;
    });

    afterEach(() => {
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch {
            // ignore cleanup errors
        }
    });

    test("reads initial journal file to EOF and sets isLive to true", async () => {
        const journalFile = path.join(tempDir, "Journal.2026-10-23T230423.01.log");
        const lines = [
            JSON.stringify({ timestamp: "2026-10-23T23:04:23Z", event: "Commander", FID: "F7637318", Name: "L00_Cyph3r" }),
            JSON.stringify({ timestamp: "2026-10-23T23:04:24Z", event: "Rank", Combat: 6, Trade: 8, Explore: 7, Soldier: 2, Exobiologist: 3, Empire: 0, Federation: 5, CQC: 0 }),
        ];
        fs.writeFileSync(journalFile, lines.join("\n") + "\n", "utf8");

        const reader = new JournalReader(tempDir);
        await reader.start();

        expect(JournalReader.isLive).toBe(true);
        expect(CommanderNameVariable.value).toBe("L00_Cyph3r");

        reader.stop();
    });

    test("incrementally reads new events when journal file is appended to", async () => {
        const journalFile = path.join(tempDir, "Journal.2026-10-23T230423.01.log");
        const initialLine = JSON.stringify({ timestamp: "2026-10-23T23:04:23Z", event: "Commander", FID: "F7637318", Name: "L00_Cyph3r" }) + "\n";
        fs.writeFileSync(journalFile, initialLine, "utf8");

        const reader = new JournalReader(tempDir);
        await reader.start();

        expect(CommanderNameVariable.value).toBe("L00_Cyph3r");
        expect(JournalReader.isLive).toBe(true);

        const appendedLines = [
            JSON.stringify({ timestamp: "2026-10-24T00:47:42Z", event: "HeatWarning" }),
            JSON.stringify({ timestamp: "2026-10-24T00:47:50Z", event: "HeatDamage" }),
            JSON.stringify({
                timestamp: "2026-10-24T01:10:47Z",
                event: "FSDJump",
                Taxi: false,
                Multicrew: false,
                StarSystem: "Sol",
                SystemAddress: 123456789,
                StarPos: [0, 0, 0],
                SystemAllegiance: "Federation",
                SystemEconomy: "$economy_Refinery;",
                SystemEconomy_Localised: "Refinery",
                SystemSecondEconomy: "$economy_Industrial;",
                SystemSecondEconomy_Localised: "Industrial",
                SystemGovernment: "$government_Democracy;",
                SystemGovernment_Localised: "Democracy",
                SystemSecurity: "$SYSTEM_SECURITY_high;",
                SystemSecurity_Localised: "High Security",
                Population: 10000000000,
                Body: "Sol",
                BodyID: 0,
                BodyType: "Star",
                JumpDist: 15.5,
                FuelUsed: 2.1,
                FuelLevel: 30.0,
            }),
        ];

        fs.appendFileSync(journalFile, appendedLines.join("\n") + "\n", "utf8");

        // Wait for fs.watch and processing
        await new Promise((resolve) => setTimeout(resolve, 300));

        expect(mockedFirebot.events.trigger).toHaveBeenCalledWith(EVENT_SOURCE_ID, JournalEventType.HeatWarning);
        expect(mockedFirebot.events.trigger).toHaveBeenCalledWith(EVENT_SOURCE_ID, JournalEventType.HeatDamage);
        expect(mockedFirebot.events.trigger).toHaveBeenCalledWith(
            EVENT_SOURCE_ID,
            JournalEventType.FSDJump,
            expect.objectContaining({ StarSystem: "Sol" })
        );
        expect(SystemNameVariable.value).toBe("Sol");

        reader.stop();
    });

    test("handles rapid consecutive appends without losing events or duplicates", async () => {
        const journalFile = path.join(tempDir, "Journal.2026-10-23T230423.01.log");
        fs.writeFileSync(journalFile, JSON.stringify({ timestamp: "2026-10-23T23:04:23Z", event: "Commander", FID: "F7637318", Name: "RapidTester" }) + "\n", "utf8");

        const reader = new JournalReader(tempDir);
        await reader.start();

        // Rapidly append lines one by one
        for (let i = 1; i <= 5; i++) {
            fs.appendFileSync(
                journalFile,
                JSON.stringify({ timestamp: `2026-10-23T23:04:2${i}Z`, event: "HeatWarning" }) + "\n",
                "utf8"
            );
        }

        await new Promise((resolve) => setTimeout(resolve, 400));

        const heatWarningCalls = mockedFirebot.events.trigger.mock.calls.filter(
            (call) => call[0] === EVENT_SOURCE_ID && call[1] === JournalEventType.HeatWarning
        );
        expect(heatWarningCalls.length).toBe(5);

        reader.stop();
    });

    test("handles empty journal directory gracefully", async () => {
        const reader = new JournalReader(tempDir);
        await reader.start();

        expect(mockedFirebot.logger.warn).toHaveBeenCalledWith("No journal file found in directory");

        reader.stop();
    });

    test("handles journal file rotation when new journal file is created", async () => {
        const journalFile1 = path.join(tempDir, "Journal.2026-10-23T230423.01.log");
        fs.writeFileSync(journalFile1, JSON.stringify({ timestamp: "2026-10-23T23:04:23Z", event: "Commander", FID: "F1", Name: "OldPilot" }) + "\n", "utf8");

        const reader = new JournalReader(tempDir, 100);
        await reader.start();

        expect(CommanderNameVariable.value).toBe("OldPilot");

        // Rotate to a new journal file with a later timestamp
        const journalFile2 = path.join(tempDir, "Journal.2026-10-24T000000.01.log");
        fs.writeFileSync(journalFile2, JSON.stringify({ timestamp: "2026-10-24T00:00:00Z", event: "Commander", FID: "F2", Name: "NewPilot" }) + "\n", "utf8");

        // Wait for polling interval (100ms) and processing
        await new Promise((resolve) => setTimeout(resolve, 300));

        expect(CommanderNameVariable.value).toBe("NewPilot");

        reader.stop();
    });
});
