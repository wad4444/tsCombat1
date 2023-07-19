import Hitbox from "./Hitbox";
import WeaponAnimationsList from "./WeaponAnimationsList";
import WeaponCooldownList from "./WeaponCooldownList";
import WeaponDamageList from "./WeaponDamageList";
import WeaponModel from "./WeaponModel";

export default interface WeaponSettings {
    AnimationsList: WeaponAnimationsList;
    DamageList: WeaponDamageList;
    Model: WeaponModel;
    Cooldowns: WeaponCooldownList;
    Hitbox: Hitbox;
    MaxCombo: number;
    ComboResetTime: number;
}