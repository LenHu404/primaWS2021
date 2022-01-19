declare namespace Script {
    import ƒ = FudgeCore;
    class CoinScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        timeStamp: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
        sin(x: number): number;
    }
}
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
        hsScore: number;
        gameRunning: boolean;
        lapRunning: boolean;
        health1: boolean;
        health2: boolean;
        health3: boolean;
        private constructor();
        static get(): GameState;
        setHealth(): void;
        hit(): number;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class LaeuferScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        jumping: boolean;
        timeStamp: number;
        ctrForward: ƒ.Control;
        ctrlRotation: ƒ.Control;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
        movement: (_event: Event) => void;
        altMovement: (_event: Event) => void;
        jump(): void;
        jumpFunc(x: number): number;
    }
}
declare namespace Script {
}
