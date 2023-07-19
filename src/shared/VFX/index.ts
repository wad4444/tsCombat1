type vfxCallback = (...args: any[]) => void;

const modules = script.GetChildren();
const loadedModules = new Map<string, vfxCallback>();

modules.forEach((module) => {
    if (!module.IsA("ModuleScript")) {
        return
    }

    loadedModules.set(module.Name, require(module) as vfxCallback);
})

export = loadedModules