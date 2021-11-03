declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class Agent extends ƒ.Node {
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
    class laserRotatorScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        speedLaserRotate: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
    }
}
