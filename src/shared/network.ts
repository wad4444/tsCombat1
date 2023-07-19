import { Networking } from "@flamework/networking";
import CombatRequest from "types/CombatRequest";

interface ServerEvents {
    CombatRequest(Request: CombatRequest): void;
}

interface ClientEvents {
    CastEffect(EffectName: string, args: unknown[]): void;
}

interface ServerFunctions {}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
