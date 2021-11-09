declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        Health: number;
        name: string;
        constructor();
        createAgent(): Promise<void>;
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        private static controller;
        private static instance;
        name: string;
        health: number;
        highscore: number;
        private constructor();
        static get(): GameState;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace LaserLeague {
}
declare namespace LaserLeague {
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class agentComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        ctrForward: ƒ.Control;
        ctrlRotation: ƒ.Control;
        agentDiameter: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
        respawn: () => void;
        movement: (_event: Event) => void;
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class GoldPoint extends ƒ.Node {
        constructor();
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class laserRotatorScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        speedLaserRotate: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
    }
}
