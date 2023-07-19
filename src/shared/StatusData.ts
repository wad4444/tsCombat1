import { Statuses } from "./enums/Statuses";

interface StatusData {
    Priority: number,
    ChangedStats: Map<string, any>
}

const StatusesData = new Map<Statuses, StatusData>([
    [Statuses.HitSlowed, {
        Priority: 1,
        ChangedStats: new Map([
            ["WalkSpeed", 8],
        ])
    }]
]);

const DefaultHumanoidStats = new Map<string, any>([
    ['WalkSpeed', 16],
    ['JumpPower', 50],
    ['AutoRotate', true],
]);

export {
    StatusesData,
    DefaultHumanoidStats
};