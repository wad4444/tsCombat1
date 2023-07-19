interface ReplicatedStorage extends Instance {
    Models: Folder;
    Animations: Folder;
    Assets: Folder & {
        EffectsPool: Folder;
    };
}