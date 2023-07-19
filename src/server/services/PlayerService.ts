import { Components } from "@flamework/components";
import { Service, OnStart, OnInit, Dependency } from "@flamework/core";
import { Players } from "@rbxts/services";
import Weapon from "server/classes/Weapons/Weapon";
import { PlayerComponent } from "server/components/PlayerComponent";
import { Events } from "server/network";
import { CombatActionType } from "shared/enums/CombatActionTypes";

const components = Dependency(Components);

@Service({})
export class PlayerService implements OnInit {
    onInit() {
        Players.PlayerAdded.Connect((Player: Player) => {
            components.addComponent<PlayerComponent>(Player);
        })

        Events.CombatRequest.connect((Player, Request) => {
            const playerComponent = components.getComponent<PlayerComponent>(Player) as PlayerComponent;
            const characterComponent = playerComponent.GetCurrentCharacter();

            if (!characterComponent) {
                return;
            }

            const weapon = characterComponent.GetWeapon()

            if (!weapon) {
                return;
            }

            switch (Request.Action) {
                case CombatActionType.Unsheathe:
                    weapon.Unsheathe();
                    break;
                case CombatActionType.Sheathe:
                    weapon.Sheathe();
                    break;
                case CombatActionType.Attack:
                    weapon.Attack();
                    break;
                case CombatActionType.Parry:
                    weapon.Parry();
                    break;
            }
        })
    }
}