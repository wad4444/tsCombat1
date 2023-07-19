export default interface CharacterModel extends Model {
    Humanoid: Humanoid & {
        Animator: Animator
    };
    HumanoidRootPart: BasePart;
    LowerTorso: BasePart;
    RightHand: BasePart;
    Animate: LocalScript;
}
