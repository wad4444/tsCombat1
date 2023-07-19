import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import CharacterModel from "types/CharacterModel";

const player = Players.LocalPlayer;
const currentCamera = Workspace.CurrentCamera as Camera;

@Controller({})
export class CameraController implements OnInit {
    onInit() {
        player.CharacterAdded.Connect((Character) => {
            const character = Character as CharacterModel;
            currentCamera.CameraSubject = character.WaitForChild("Humanoid") as Humanoid;
        })
    }
}