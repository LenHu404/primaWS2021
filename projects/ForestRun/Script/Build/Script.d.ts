declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        private static controller;
        private static instance;
        name: string;
        health: number;
        score: number;
        gameRunning: boolean;
        lapRunning: boolean;
        private constructor();
        static get(): GameState;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class LaeuferScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        ctrForward: ƒ.Control;
        ctrlRotation: ƒ.Control;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
        movement: (_event: Event) => void;
        altMovement: (_event: Event) => void;
    }
}
declare namespace Script {
}
