import { Workspace } from "@rbxts/services";
import Hitbox from "types/Hitbox";
import { Box } from "./Debugger";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import { CharacterComponent } from "server/components/CharacterComponent";

const components = Dependency(Components);

const TrackPartsInHitbox = function(Hitbox : Hitbox, Center : CFrame, Filter: Instance[] = []): Instance[] {
    const centerPosition: Vector3 = Center.Position;
    const zoneRegion: Region3 = new Region3(
        centerPosition.add(Hitbox.Start),
        centerPosition.add(Hitbox.End)
    );

    const regionSize = zoneRegion.Size;
    const [x,y,z] = Center.ToEulerAnglesXYZ();
    const regionCFrame = zoneRegion.CFrame.mul(CFrame.Angles(x,y,z));

    const overlapParameters = new OverlapParams();
    overlapParameters.FilterDescendantsInstances = Filter;
    overlapParameters.FilterType = Enum.RaycastFilterType.Blacklist;

    Box(regionCFrame, regionSize, 1);

    const partsInRegion = Workspace.GetPartBoundsInBox(
        regionCFrame,
        regionSize, 
        overlapParameters,
    );

    return partsInRegion;
}

const TrackCharactersInHitbox = function(Hitbox : Hitbox, Center : CFrame, Filter: Instance[] = []): CharacterComponent[] {
    const partsInHitbox = TrackPartsInHitbox(Hitbox, Center, Filter);
    const characters: CharacterComponent[] = [];

    partsInHitbox.forEach(part => {
        if (part.Name === "Weapon") {
            return;
        }

        const possibleChar = part.FindFirstAncestorOfClass("Model");
        const humanoid = possibleChar?.FindFirstChildOfClass("Humanoid");

        if (!humanoid) {
            return;
        };

        const charComponent = components.getComponent<CharacterComponent>(possibleChar as Model);

        if (!charComponent) {
            return;
            
        }

        if (!characters.find((char) => charComponent === char)) {
            characters.push(charComponent);
        };
    });

    return characters;
}

export {
    TrackPartsInHitbox,
    TrackCharactersInHitbox
}