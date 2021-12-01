namespace Script {
    import ƒ = FudgeCore;
    import ƒui = FudgeUserInterface;

    export class GameState extends ƒ.Mutable {
        private static controller: ƒui.Controller;
        private static instance: GameState;
        public name: string = "MarkusCart";
        public lapprogress: number = 0;
        public laptime: number = 0;
        public laptimeString: string = "";
        public laps: number = 0;
        public gameRunning: boolean = false;
        public speed: string = "0 m/s";
        public lapRunning: boolean = false;
        public startTime: ƒ.Time;

        private constructor() {
            super();
            let domHud: HTMLDivElement = document.querySelector("#Hud");
            GameState.instance = this;
            GameState.controller = new ƒui.Controller(this, domHud);
            console.log("Hud-Controller", GameState.controller);
        }

        public static get(): GameState {
            return GameState.instance || new GameState();
        }

        protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
    }
}