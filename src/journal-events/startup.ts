import {JournalEvent} from "./index";

// { "timestamp":"2026-10-23T23:04:23Z", "event":"Commander", "FID":"F7637318", "Name":"L00_Cyph3r" }
export type CommanderEvent = JournalEvent & {
    Name: string;
}
export type RankEvent = JournalEvent & {
    Combat: number;
    Trade: number;
    Explore: number;
    Soldier: number;
    Exobiologist: number;
    Empire: number;
    Federation: number;
    CQC: number;
}

// { "timestamp":"2026-10-23T23:04:23Z", "event":"Rank", "Combat":6, "Trade":8, "Explore":7, "Soldier":2, "Exobiologist":3, "Empire":0, "Federation":5, "CQC":0 }
export type RankProgressEvent = JournalEvent & {
    Combat: number;
    Trade: number;
    Explore: number;
    Soldier: number;
    Exobiologist: number;
    Empire: number;
    Federation: number;
    CQC: number;
}
// { "timestamp":"2026-10-23T23:04:23Z", "event":"Reputation", "Empire":75.000000, "Federation":77.184097, "Independent":0.000000, "Alliance":90.240997 }
export type ReputationEvent = JournalEvent & {
    Empire: number;
    Federation: number;
    Independent: number;
    Alliance: number;
}


// { "timestamp":"2026-10-23T23:04:23Z", "event":"EngineerProgress", "Engineers":[ { "Engineer":"The Sarge", "EngineerID":300040, "Progress":"Unlocked", "RankProgress":0, "Rank":5 }, { "Engineer":"Professor Palin", "EngineerID":300220, "Progress":"Unlocked", "RankProgress":0, "Rank":5 }, { "Engineer":"Felicity Farseer", "EngineerID":300100, "Progress":"Unlocked", "RankProgress":0, "Rank":5 }, { "Engineer":"Eleanor Bresa", "EngineerID":400011, "Progress":"Known" }, { "Engineer":"Hero Ferrari", "EngineerID":400003, "Progress":"Known" }, { "Engineer":"Jude Navarro", "EngineerID":400001, "Progress":"Known" }, { "Engineer":"Lori Jameson", "EngineerID":300230, "Progress":"Unlocked", "RankProgress":0, "Rank":5 }, { "Engineer":"Bill Turner", "EngineerID":300010, "Progress":"Invited" }, { "Engineer":"Liz Ryder", "EngineerID":300080, "Progress":"Invited" }, { "Engineer":"Rosa Dayette", "EngineerID":400012, "Progress":"Known" }, { "Engineer":"Juri Ishmaak", "EngineerID":300250, "Progress":"Unlocked", "RankProgress":0, "Rank":5 }, { "Engineer":"Zacariah Nemo", "EngineerID":300050, "Progress":"Known" }, { "Engineer":"Mel Brandon", "EngineerID":300280, "Progress":"Known" }, { "Engineer":"Selene Jean", "EngineerID":300210, "Progress":"Unlocked", "RankProgress":0, "Rank":5 }, { "Engineer":"Marco Qwent", "EngineerID":300200, "Progress":"Unlocked", "RankProgress":0, "Rank":5 }, { "Engineer":"Chloe Sedesi", "EngineerID":300300, "Progress":"Invited" }, { "Engineer":"Baltanos", "EngineerID":400010, "Progress":"Known" }, { "Engineer":"Petra Olmanova", "EngineerID":300130, "Progress":"Invited" }, { "Engineer":"Ram Tah", "EngineerID":300110, "Progress":"Unlocked", "RankProgress":17, "Rank":2 }, { "Engineer":"The Dweller", "EngineerID":300180, "Progress":"Unlocked", "RankProgress":0, "Rank":5 }, { "Engineer":"Elvira Martuuk", "EngineerID":300160, "Progress":"Unlocked", "RankProgress":0, "Rank":5 }, { "Engineer":"Lei Cheung", "EngineerID":300120, "Progress":"Unlocked", "RankProgress":0, "Rank":5 }, { "Engineer":"Colonel Bris Dekker", "EngineerID":300140, "Progress":"Invited" }, { "Engineer":"Didi Vatermann", "EngineerID":300000, "Progress":"Invited" }, { "Engineer":"Tod 'The Blaster' McQuinn", "EngineerID":300260, "Progress":"Unlocked", "RankProgress":0, "Rank":5 }, { "Engineer":"Domino Green", "EngineerID":400002, "Progress":"Invited" }, { "Engineer":"Marsha Hicks", "EngineerID":300150, "Progress":"Invited" } ] }
export type EngineerProgressEvent = JournalEvent & {
    Engineers: Engineer[];
}

type Engineer = JournalEvent & {
    Engineer: string;
    EngineerID: number;
    Progress: string;
    RankProgress: number;
    Rank: number;
}

// { "timestamp":"2026-10-23T23:04:23Z", "event":"LoadGame", "FID":"F7637318", "Commander":"L00_Cyph3r", "Horizons":true, "Odyssey":true, "Ship":"AnacondaMkII", "Ship_Localised":"Anaconda Mk II", "ShipID":33, "ShipName":"Bonnie Blue", "ShipIdent":"1000", "FuelLevel":64.000000, "FuelCapacity":64.000000, "GameMode":"Group", "Group":"Orange Pheonix", "Credits":1665615189, "Loan":0, "language":"English/UK", "gameversion":"4.4.2.1", "build":"r334925/r0 " }
export type LoadGameEvent = JournalEvent & {
    FID: string;
    Commander: string;
    Horizons: boolean;
    Odyssey: boolean;
    Ship: string | undefined;
    Ship_Localised: string | undefined;
    ShipID: number | undefined,
    ShipName: string | undefined,
    ShipIdent: string | undefined,
    FuelLevel: number | undefined,
    FuelCapacity: number | undefined,
    GameMode: 'Group' | 'Open' | 'Solo',
    Group: string | undefined,
    Credits: number,
    Loan: number,
}

// { "timestamp":"2026-10-23T23:04:25Z", "event":"SquadronStartup", "SquadronID":2727, "SquadronName":"THE FUEL RATS", "CurrentRank":3, "CurrentRankName":"rat" }
export type SquadronStartupEvent = JournalEvent & {
    SquadronID: number;
    SquadronName: string;
    CurrentRank: number;
    CurrentRankName: string;
}