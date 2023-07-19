import Hitbox from "types/Hitbox";
import WeaponAnimationsList from "types/WeaponAnimationsList";
import WeaponDamageList from "types/WeaponDamageList";
import WeaponSettings from "types/WeaponSettings";
import CharacterModel from "types/CharacterModel";
import WeaponModel from "types/WeaponModel";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import { CharacterComponent } from "server/components/CharacterComponent";
import { TrackCharactersInHitbox } from "../HitboxTracker";
import { Statuses } from "shared/enums/Statuses";
import WeaponCooldownList from "types/WeaponCooldownList";
import { Events } from "server/network";

const components = Dependency(Components)

export default abstract class Weapon {
    protected readonly animationsList: WeaponAnimationsList;
    protected readonly damageList: WeaponDamageList;
    protected readonly model: WeaponModel;
    protected readonly cooldownList: WeaponCooldownList;
    protected readonly hitbox: Hitbox;
    protected readonly comboResetTime: number;
    protected readonly maxCombo: number;
    
    private isEquipped: boolean;
    private combo: number;
    private lastAttackTime?: number;

    protected character?: CharacterComponent;

    constructor(weaponSettings: WeaponSettings) {
        this.animationsList = weaponSettings.AnimationsList;
        this.damageList = weaponSettings.DamageList;
        this.cooldownList = weaponSettings.Cooldowns;
        this.model = weaponSettings.Model.Clone();
        this.hitbox = weaponSettings.Hitbox;

        this.isEquipped = false;
        this.combo = 1;
        this.comboResetTime = weaponSettings.ComboResetTime;
        this.maxCombo = weaponSettings.MaxCombo;

        this.model.Name = "Weapon";
    }

    public Equip(newCharacter: CharacterModel) {
        const primaryWeld = this.model.PrimaryWeld;
        primaryWeld.Part0 = newCharacter.LowerTorso;
        primaryWeld.Part1 = this.model;
        primaryWeld.Enabled = true;

        const primaryMotor = this.model.PrimaryMotor;
        primaryMotor.Part0 = newCharacter.RightHand;
        primaryMotor.Part1 = this.model;
        primaryMotor.Enabled = false;

        this.model.Parent = newCharacter;

        const characterComponent = components.getComponent<CharacterComponent>(newCharacter);
        this.character = characterComponent;
    }

    public Unsheathe() {
        const character = this.character as CharacterComponent;
        const animTrack = character.LoadAnimation(this.animationsList.Unsheathe);

        animTrack.KeyframeReached.Connect((KeyframeName) => {
            if (KeyframeName === "Equip") {
                this.model.PrimaryMotor.Enabled = true;
                this.model.PrimaryWeld.Enabled = false;
                this.isEquipped = true;
            }
        })

        animTrack.Play()
    }

    public Sheathe() {
        const character = this.character as CharacterComponent;
        const animTrack = character.LoadAnimation(this.animationsList.Sheathe);

        animTrack.KeyframeReached.Connect((KeyframeName) => {
            if (KeyframeName === "Unequip") {
                this.model.PrimaryMotor.Enabled = false;
                this.model.PrimaryWeld.Enabled = true;
                this.isEquipped = false;
            }
        })

        animTrack.Play()
    }

    protected updateCombo() {
        if (!this.lastAttackTime) {
            return;
        }

        if (os.clock() - this.lastAttackTime > this.comboResetTime) {
            this.combo = 1;
            return;
        }

        if (this.combo > this.maxCombo) {
            this.combo = 1;
            return;
        }
    }

    public Attack() {
        const character = this.character as CharacterComponent;

        if (character.HasStatus([Statuses.AttackCD, Statuses.ParryFrames])) {
            return;
        }

        if (!this.isEquipped) {
            return;
        }

        this.updateCombo();

        const animationName = this.animationsList.Attacks.get(this.combo) as string;
        const animTrack = character.LoadAnimation(animationName);

        animTrack.KeyframeReached.Connect((KeyframeName) => {
            if (KeyframeName !== "Start") {
                return;
            }

            const charModel = this.character?.instance;
            const rootPart = charModel?.HumanoidRootPart;
            const center = rootPart?.CFrame.add(rootPart?.CFrame.LookVector.mul(3));

            const charsInHitbox = TrackCharactersInHitbox(this.hitbox, center as CFrame, [charModel as Instance]);

            const damageToDeal = this.damageList.Attacks.get(this.combo) || this.damageList.Default;

            charsInHitbox.forEach(enemyCharacter => {
                enemyCharacter.AddStatus(Statuses.HitSlowed, this.cooldownList.HitSlowed);

                if (enemyCharacter.HasStatus(Statuses.ParryFrames)) {
                    const weapon = enemyCharacter.GetWeapon();
                    const weaponModel = weapon?.GetModel();

                    if (!weaponModel) {
                        return;
                    }

                    Events.CastEffect.broadcast("Parry", [weaponModel]);
                    return;
                }

                enemyCharacter.TakeDamage(damageToDeal);
            });
        })

        animTrack.Play()
        character.AddStatus(Statuses.AttackCD, this.cooldownList.Attacks.get(this.combo));
        character.AddStatus(Statuses.HitSlowed, this.cooldownList.HitSlowed);
        
        this.lastAttackTime = os.clock();
        this.combo++;
    }

    public Parry() {
        const character = this.character as CharacterComponent;

        if (character.HasStatus(Statuses.ParryCD)) {
            return;
        }

        if (!this.isEquipped) {
            return;
        }

        const parryTrack = character.LoadAnimation("Parry");
        parryTrack.KeyframeReached.Connect((KeyframeName) => {
            if (KeyframeName === "Start") {
                character.AddStatus(Statuses.ParryFrames, 10);
            }
        })

        parryTrack.Play();
        character.AddStatus(Statuses.ParryCD, 1.5);
    } 

    public GetCombo(): number {
        return this.combo;
    }

    public GetModel() {
        return this.model; 
    }
}