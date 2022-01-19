namespace Script {
    import ƒ = FudgeCore;
    import ƒui = FudgeUserInterface;

    export class GameState extends ƒ.Mutable {
        private static controller: ƒui.Controller;
        private static instance: GameState;
        public name: string = "Run Forest Run";
        public health: number = 100;
        public score: number = 0;
        public hsScore: number = 0;
        public gameRunning: boolean = false;
        public lapRunning: boolean = false;
        public health1: boolean = true;
        public health2: boolean = true;
        public health3: boolean = true;



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

        public setHealth(): void {
            if (this.health1) {
                document.querySelector("#health1").removeAttribute("style");
            } else {  
                document.querySelector("#health1").setAttribute("style","display:none");
            }
            if (this.health2) {
                document.querySelector("#health2").removeAttribute("style");
            } else {  
                document.querySelector("#health2").setAttribute("style","display:none");
            }
            if (this.health3) {
                document.querySelector("#health3").removeAttribute("style");
            } else {  
                document.querySelector("#health3").setAttribute("style","display:none");
            }
            
        }

        public hit(): number {
            if (this.health3)  {
                this.health3 = false
                this.setHealth();
                return 2;
            }
            else if (this.health2) {
                this.health2 = false
                this.setHealth();
                return 1;
            }
            else {
                this.health1 = false
                this.setHealth();
                return 0;
            }
                
        }

        protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
    }
}