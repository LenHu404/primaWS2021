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
    class Datafile {
        hsore: number;
        constructor();
        save(): void;
        getData(): void;
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
        hScore: number;
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
    enum MoveState {
        forward = 0,
        backwards = 1,
        idle = 2
    }
    export class LaeuferScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        jumping: boolean;
        timeStamp: number;
        ctrForward: ƒ.Control;
        ctrlRotation: ƒ.Control;
        body: ƒ.Node;
        head: ƒ.Node;
        lLeg: ƒ.Node;
        rLeg: ƒ.Node;
        lArm: ƒ.Node;
        rArm: ƒ.Node;
        moving: MoveState;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
        start: () => void;
        altMovement: (_event: Event) => void;
        jump(): void;
        jumpFunc(x: number): number;
        sin(x: number): number;
        animation(): void;
        map_range(v: number, from_min: number, from_max: number, to_min: number, to_max: number): number;
    }
    export {};
}
declare namespace Script {
}
