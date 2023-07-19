import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { CombatActionType } from "shared/enums/CombatActionTypes";
import CharacterModel from "types/CharacterModel";

const player = Players.LocalPlayer;

function onCharacter() {
    const backpack = player.WaitForChild("Backpack");
    const weaponTool = backpack.WaitForChild("Weapon") as Tool;

    weaponTool.Equipped.Connect(() => {
        Events.CombatRequest.fire({
            Action: CombatActionType.Unsheathe,
        });
    });

    weaponTool.Unequipped.Connect(() => {
        Events.CombatRequest.fire({
            Action: CombatActionType.Sheathe,
        });
    })

    weaponTool.Activated.Connect(() => {
        Events.CombatRequest.fire({
            Action: CombatActionType.Attack,
        });
    })
}

@Controller({})
export class WeaponController implements OnInit {
    onInit() {
        player.CharacterAdded.Connect(onCharacter);

        UserInputService.InputBegan.Connect((Input) => {
            switch (Input.KeyCode) {
                case Enum.KeyCode.F:
                    Events.CombatRequest.fire({
                        Action: CombatActionType.Parry
                    })
                    break;
            }
        });
    }
}