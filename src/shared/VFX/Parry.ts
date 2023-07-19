import { ReplicatedStorage } from "@rbxts/services"
import CharacterModel from "types/CharacterModel";

const pool = ReplicatedStorage.Assets.EffectsPool.FindFirstChild("Parry") as Folder;
const emitters = pool.GetChildren();

export = (WeaponModel : BasePart) => {
    const newAttachment = new Instance("Attachment");
    newAttachment.Parent = WeaponModel;
    newAttachment.CFrame = new CFrame(0,.7,0);

    emitters.forEach((emitter) => {
        if (!emitter.IsA("ParticleEmitter")) {
            return
        }

        const newEmitter = emitter.Clone();
        newEmitter.Parent = newAttachment;
        newEmitter.Emit(newEmitter.GetAttribute("EmitCount") as number | 0);
    })
}