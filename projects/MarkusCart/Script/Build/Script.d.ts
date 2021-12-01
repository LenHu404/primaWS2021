declare namespace Script {
    import ƒ = FudgeCore;
    class CartCustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        lapProgress: number;
        lapTime: number;
        ctrForward: ƒ.Control;
        ctrTurn: ƒ.Control;
        cpArray: boolean[];
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
        reset: () => void;
        resetLight: (cpNumber: number) => void;
        cartControlls: (_event: Event) => void;
        map_range(v: number, from_min: number, from_max: number, to_min: number, to_max: number): number;
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
        lapprogress: number;
        laptime: number;
        laptimeString: string;
        laps: number;
        gameRunning: boolean;
        speed: string;
        lapRunning: boolean;
        startTime: ƒ.Time;
        private constructor();
        static get(): GameState;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
}
