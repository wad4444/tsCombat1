export default interface WeaponCooldownList {
    Attacks: Map<number, number>;
    Block: number;
    Parry: number;
    HitSlowed: number;
}