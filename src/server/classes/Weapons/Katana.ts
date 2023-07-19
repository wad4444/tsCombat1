import WeaponSettings from "types/WeaponSettings";
import Weapon from "./Weapon";
import { ReplicatedStorage } from "@rbxts/services";
import WeaponModel from "types/WeaponModel";

const katanaSettings: WeaponSettings = {
    AnimationsList: {
        Attacks: new Map<number, string>([
            [1, "WeaponHit1"],
            [2, "WeaponHit2"],
            [3, "WeaponHit3"],
            [4, "WeaponHit4"],
            [5, "WeaponHit5"],
        ]),
        Block: "",
        Unsheathe: "Unsheathe1",
        Sheathe: "Sheathe1",
    },
    DamageList: {
        Default: 5,
        Attacks: new Map<number, number>([
            [1, 5],
            [2, 5],
            [3, 5],
            [4, 5],
            [5, 5],
        ]),
        Block: 0
    },
    Cooldowns: {
        Attacks: new Map<number, number>([
            [1, .5],
            [2, .5],
            [3, .5],
            [4, .5],
            [5, 1.7],
        ]),
        Block: .2,
        Parry: 1,
        HitSlowed: .5,
    },
    Model: ReplicatedStorage.Models.FindFirstChild("Katana") as WeaponModel,
    Hitbox: {
        Start: new Vector3(-2,-4,-4),
        End: new Vector3(2,2,4)
    },
    MaxCombo: 5,
    ComboResetTime: 1.5,
}

export default class Katana extends Weapon {
    constructor() {
        super(katanaSettings);
    }
}