import { Dependency, OnStart } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import { CharacterComponent } from "./CharacterComponent";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

const components = Dependency(Components);

@Component({})
export class PlayerComponent extends BaseComponent<{}, Player> implements OnStart {
    private currentCharacter?: CharacterComponent

    onStart() {
        const player = this.instance;

        player.CharacterAdded.Connect((newModel) => {
            const character = components.addComponent<CharacterComponent>(newModel);
            character.instance.Humanoid.Died.Connect(() => this.spawnCharacter())
    
            this.currentCharacter = character;
        })

        this.spawnCharacter();
    }

    private spawnCharacter() {
        if (this.currentCharacter) {
            this.currentCharacter.Destroy();
        }

        const player = this.instance;
        player.LoadCharacter();
    }

    public GetCurrentCharacter() {
        return this.currentCharacter
    }
}