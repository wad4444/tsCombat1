import { CombatActionType } from "shared/enums/CombatActionTypes";

export default interface CombatRequest {
    Action: CombatActionType;
    SpacebarHeld?: boolean;
}