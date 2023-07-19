import { Controller, OnInit } from "@flamework/core";
import { Events } from "client/network";
import loadedModules from "shared/VFX";

@Controller({})
export class EffectsController implements OnInit {
    onInit() {
        Events.CastEffect.connect((EffectName, args) => {
            const callbackToCast = loadedModules.get(EffectName);

            if (callbackToCast === undefined) {
                return
            }

            callbackToCast(...args);
        })
    }
}