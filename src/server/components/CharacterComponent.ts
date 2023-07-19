import { Dependency, OnStart } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import CharacterModel from "types/CharacterModel";
import Katana from "server/classes/Weapons/Katana";
import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import { PlayerComponent } from "./PlayerComponent";
import Weapon from "server/classes/Weapons/Weapon";
import { Statuses } from "shared/enums/Statuses";
import { StatusesData, DefaultHumanoidStats } from "shared/StatusData";
import { Events } from "server/network";

const components = Dependency(Components)

interface WrappedStatusPoint {
    ChangedTo: any,
    ChangedBy: number
}

@Component({
    tag: "GameCharacter",
})
export class CharacterComponent extends BaseComponent<{}, CharacterModel> implements OnStart {
    private blockHealth = 100;
    private health = 100;
    private player?: PlayerComponent;
    private weapon?: Weapon;
    private statuses: string[] = [];
    private updateConnection?: RBXScriptConnection;

    public onStart() {
        const playerInstance = Players.GetPlayerFromCharacter(this.instance) as Player;
        const playerComponent = components.getComponent<PlayerComponent>(playerInstance);

        const newWeapon = new Katana();
        newWeapon.Equip(this.instance);

        if (playerComponent) {
            const newControlTool = new Instance("Tool");
            newControlTool.RequiresHandle = false;
            newControlTool.CanBeDropped = false;
            newControlTool.Parent = playerInstance.Backpack;
            newControlTool.Name = "Weapon";

            this.player = playerComponent;
        }

        this.weapon = newWeapon;
        this.updateConnection = RunService.Heartbeat.Connect(() => this.update());
    };

    public GetPlayer(): PlayerComponent {
        return this.player as PlayerComponent;
    };

    public GetWeapon(): Weapon | undefined {
        return this.weapon as Weapon;
    };

    public Destroy() {
        this.instance.Destroy();
        this.updateConnection?.Disconnect();
    };

    public LoadAnimation(Animation: string|Animation): AnimationTrack {
        const humanoid = this.instance.Humanoid;

        if (typeOf(Animation) === "string") {
            Animation = ReplicatedStorage.Animations.WaitForChild(Animation as string) as Animation;
        }

        return humanoid.Animator.LoadAnimation(Animation as Animation);
    };

    public AddStatus(Status: Statuses, Lifetime?: number): void {
        const statusToString = tostring(Status);
        const randomId = tostring(math.random());

        const convertedStatus = statusToString + "||" + randomId;
        this.statuses.push(convertedStatus);

        if (!Lifetime) {
            return
        }

        task.delay(Lifetime, () => {
            const foundIndex = this.statuses.findIndex((status) => status === convertedStatus);

            if (foundIndex === undefined) {
                return
            }

            this.statuses.remove(foundIndex);
        })
    };

    public HasStatus(Status: Statuses|Statuses[]): boolean {
        const StatusesToCheck = typeOf(Status) === "table" ? Status as Statuses[] : [Status as Statuses];
        let result = false;

        this.statuses.forEach((rawStatus) => {
            const converted = rawStatus.split("||");

            if (converted.size() < 1) {
                return
            }

            if (StatusesToCheck.find((element) => converted[0] === tostring(element))) {
                result = true;
                return
            }
        })

        return result;
    };

    public GetAllStatuses(): Statuses[] {
        const result: Statuses[] = [];

        this.statuses.forEach((rawStatus) => {
            const converted = rawStatus.split("||");

            if (converted.size() < 1) {
                return
            }

            result.push(tonumber(converted[0]) as Statuses);
        })

        return result;
    };

    public RemoveStatus(Status: Statuses|Statuses[]) {
        const StatusesToRemove = typeOf(Status) === "table" ? Status as Statuses[] : [Status as Statuses];

        this.statuses.forEach((rawStatus, index) => {
            const converted = rawStatus.split("||");

            if (converted.size() < 1) {
                return
            }

            if (StatusesToRemove.find((Status) => tostring(Status) === converted[0])) {
                this.statuses.remove(index);
            }
        })
    };

    public RemoveAllStatuses() {
        this.statuses.clear();
    };

    public TakeDamage(Damage: number) {
        const humanoid = this.instance.Humanoid;
        if (humanoid.Health > 1) {
            humanoid.Health = math.max(1, humanoid.Health - Damage);
        }

        const animationsFolder = ReplicatedStorage.Animations
        const damagedAnims = ["GotHit1", "GotHit2"];

        const damagedAnimTrack = this.LoadAnimation(damagedAnims[math.random(0, damagedAnims.size() - 1)]);
        damagedAnimTrack.Play()

        Events.CastEffect.broadcast("GotHit", [this.instance]);
    }

    private update() {
        const newHumStats = new Map<string, WrappedStatusPoint>();

        this.statuses.forEach((rawStatus) => {
            const status = tonumber(rawStatus.split("||")[0]) as Statuses;
            const statusData = StatusesData.get(status);

            if (statusData === undefined) {
                return
            }

            statusData.ChangedStats.forEach((setsTo, statName) => {
                const currentStatData = newHumStats.get(statName);

                if (currentStatData === undefined) {
                    newHumStats.set(statName, {
                        ChangedTo: setsTo,
                        ChangedBy: statusData.Priority
                    })
                    return
                }
                else if (currentStatData.ChangedBy < statusData.Priority) {
                    newHumStats.set(statName, {
                        ChangedTo: setsTo,
                        ChangedBy: statusData.Priority
                    })
                    return
                }
            })
        })

        DefaultHumanoidStats.forEach((defaultValue, statName) => {
            if (newHumStats.get(statName)) {
                return
            }

            newHumStats.set(statName, {
                ChangedTo: defaultValue,
                ChangedBy: 0
            })
        })

        newHumStats.forEach((value, statName) => {
            const setTo = value.ChangedTo;
            this.instance.Humanoid[statName as never] = setTo as never;
        })
    };
}