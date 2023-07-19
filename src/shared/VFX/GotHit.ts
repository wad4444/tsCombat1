import { ReplicatedStorage } from "@rbxts/services"
import CharacterModel from "types/CharacterModel";

const pool = ReplicatedStorage.Assets.EffectsPool.FindFirstChild("GotHit") as Folder;
const emitters = pool.GetChildren();

export = (character: CharacterModel) => {
    const newAttachment = new Instance("Attachment");
    newAttachment.Parent = character.HumanoidRootPart;

    emitters.forEach((emitter) => {
        if (!emitter.IsA("ParticleEmitter")) {
            return
        }

        const newEmitter = emitter.Clone();
        newEmitter.Parent = newAttachment;
        newEmitter.Emit(newEmitter.GetAttribute("EmitCount") as number | 0);
    })
}