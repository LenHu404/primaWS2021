namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    enum MoveState {
        forward,
        backwards,
        idle
    }

    export class LaeuferScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(LaeuferScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        public message: string = "LaeuferScript added to ";
        public jumping: boolean = false;
        public timeStamp: number = 0;

        public ctrForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL)
        public ctrlRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);

        public body: ƒ.Node;
        public head: ƒ.Node;
        public lLeg: ƒ.Node;
        public rLeg: ƒ.Node;
        public lArm: ƒ.Node;
        public rArm: ƒ.Node;
        public moving: MoveState;

        constructor() {
            super();

            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            // Listen to this component being added to or removed from a node
            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
        }

        // Activate the functions of this component as response to events
        public hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                    ƒ.Debug.log(this.message, this.node);
                    //this.start();
                    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                    break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    break;
            }
        }

        public update = (_event: Event) => {
            let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
            if (GameState.get().gameRunning)
                this.altMovement(_event);
            if (this.jumping)
                this.timeStamp += 1 * deltaTime;
            this.jump();
            //console.log("timeStamp", this.timeStamp);
            //console.log("jumpY", this.jumpFunc(this.timeStamp));
            // console.log("math: ", Math.pow(0-2,2));
        }

        public start = (): void => {
            console.log("name ", this.node);
            this.body = this.node.getChild(0);
            console.log("name ", this.body);

            this.head = this.node.getChildrenByName("body")[0].getChildrenByName("head")[0];
            this.lLeg = this.node.getChildrenByName("body")[0].getChildrenByName("lLeg")[0];
            this.rLeg = this.node.getChildrenByName("body")[0].getChildrenByName("rLeg")[0];
            this.lArm = this.node.getChildrenByName("body")[0].getChildrenByName("lArm")[0];
            this.rArm = this.node.getChildrenByName("body")[0].getChildrenByName("rArm")[0];

        }

        public altMovement = (_event: Event) => {

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && !this.jumping) {
                this.jumping = true;
                this.jump();
                console.log("jump!");

            }

            let deltaTime: number = ƒ.Loop.timeFrameReal / 1000

            let speedAgentTranslation: number = 10;

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {

                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                    this.node.mtxLocal.translateZ((speedAgentTranslation * deltaTime * 2) / 3)
                } else {
                    this.node.mtxLocal.translateZ(speedAgentTranslation * deltaTime)
                    this.node.mtxLocal.rotation= new ƒ.Vector3(0,0,0);
                }
                this.moving = MoveState.forward;

            } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {

                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                    this.node.mtxLocal.translateZ((-speedAgentTranslation * deltaTime * 2) / 3)
                } else {
                    this.node.mtxLocal.translateZ(-speedAgentTranslation * deltaTime)
                    this.node.mtxLocal.rotation= new ƒ.Vector3(0,0,0);
                }
                this.moving = MoveState.backwards;
            }
            else {
                this.node.mtxLocal.rotation= new ƒ.Vector3(0,0,0);
                this.moving = MoveState.idle;
            }

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {

                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                    this.node.mtxLocal.translateX((-speedAgentTranslation * deltaTime * 2) / 3)
                } else {
                    this.node.mtxLocal.translateX(-speedAgentTranslation * deltaTime)
                }
                this.node.mtxLocal.rotation= new ƒ.Vector3(0,-30,0);

            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {

                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                    this.node.mtxLocal.translateX((speedAgentTranslation * deltaTime * 2) / 3)
                } else {
                    this.node.mtxLocal.translateX(speedAgentTranslation * deltaTime)
                }

                this.node.mtxLocal.rotation= new ƒ.Vector3(0,30,0);
            }

            let currPos: ƒ.Vector3 = this.node.mtxLocal.translation;
            //console.log(agent.mtxLocal.translation.toString());

            if (this.node.mtxLocal.translation.x + this.node.radius > 6) {
                //console.log("+x");
                this.node.mtxLocal.translation = new ƒ.Vector3(6 - this.node.radius, currPos.y, currPos.z);
            }
            if (this.node.mtxLocal.translation.x - this.node.radius < -6) {
                //console.log("-x");
                this.node.mtxLocal.translation = new ƒ.Vector3(-6 + this.node.radius, currPos.y, currPos.z);
            }

            if (this.node.mtxLocal.translation.z + this.node.radius > 6) {
                //console.log("+z");
                this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x, currPos.y, 6 - this.node.radius);
            }
            if (this.node.mtxLocal.translation.z - this.node.radius < -10) {
                //console.log("-z");
                this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x, currPos.y, -10 + this.node.radius);
            }
        }

        public jump(): void {
            //console.log("timeStamp", this.timeStamp);
            //console.log("jumpY", this.jumpFunc(this.timeStamp));
            let currPos: ƒ.Vector3 = this.node.mtxLocal.translation;
            this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x, this.jumpFunc(this.timeStamp) + 0.75, currPos.z);
            if (this.jumpFunc(this.timeStamp) < 0) {
                this.jumping = false;
                this.timeStamp = 0;
            }

        }

        public jumpFunc(x: number): number {
            let result: number = -(Math.pow((x * 4) - 1.41, 2)) + 2;
            return result;
        }

        public sin(x: number): number {
            return Math.sin(Math.PI * x);
        }


        public animation(): void {
            let rotation: number = this.map_range(this.sin(this.timeStamp), 1,0,-20,20);
            if (this.moving == MoveState.forward) {

                this.lLeg.mtxLocal.rotation = new ƒ.Vector3(rotation,0,0);
                this.rLeg.mtxLocal.rotation = new ƒ.Vector3(-rotation,0,0);
                this.lArm.mtxLocal.rotation = new ƒ.Vector3(-rotation,0,0);
                this.rArm.mtxLocal.rotation = new ƒ.Vector3(rotation,0,0);
            }
        }

        public map_range(v: number, from_min: number, from_max: number, to_min: number, to_max: number): number {
            return to_min + (v - from_min) * (to_max - to_min) / (from_max - from_min);
        }


        // protected reduceMutator(_mutator: ƒ.Mutator): void {
        //   // delete properties that should not be mutated
        //   // undefined properties and private fields (#) will not be included by default
        // }
    }
}