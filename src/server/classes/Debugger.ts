import { Debris, Workspace } from "@rbxts/services";

const Box = function(CFrame : CFrame, Size : Vector3, Lifetime: number = 5) {
    const newBox = new Instance("Part");
    newBox.CFrame = CFrame;
    newBox.Size = Size;
    newBox.Transparency = .85;
    newBox.BrickColor = BrickColor.Red();
    newBox.Parent = Workspace;
    newBox.Anchored = true;
    newBox.CanCollide = false;
    newBox.Material = Enum.Material.SmoothPlastic;

    Debris.AddItem(newBox, Lifetime);
}

export {
    Box
}