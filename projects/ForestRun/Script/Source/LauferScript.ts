namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class LaeuferScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(LaeuferScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        public message: string = "LaeuferScript added to ";
        public jumping: boolean = false;
        public timeStamp: number = 0;

        public ctrForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL)
        public ctrlRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);


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

        public movement = (_event: Event): void => {
            let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

            let speedAgentTranslation: number = 10; // meters per second
            let speedAgentRotation: number = 360; // meters per second

            let speedValue: number = (
                ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
                + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
            )
            this.ctrForward.setInput(speedValue * deltaTime);
            this.node.mtxLocal.translateX(this.ctrForward.getOutput() * speedAgentTranslation);

            let rotationValue: number = (
                ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                + (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));

            this.ctrlRotation.setInput(rotationValue * deltaTime);
            this.node.mtxLocal.rotateY(this.ctrlRotation.getOutput() * speedAgentRotation);

            let agentRadius: number = this.node.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2;


            //let groundScale: ƒ.Vector2 = new ƒ.Vector2()


            let currPos: ƒ.Vector3 = this.node.mtxLocal.translation;
            //console.log(agent.mtxLocal.translation.toString());

            if (this.node.mtxLocal.translation.x + agentRadius > 24.5) {
                //console.log("+x");
                this.node.mtxLocal.translation = new ƒ.Vector3(-24.5 + agentRadius, currPos.y, currPos.z);
            }
            if (this.node.mtxLocal.translation.x - agentRadius < -24.5) {
                //console.log("-x");
                this.node.mtxLocal.translation = new ƒ.Vector3(24.5 - agentRadius, currPos.y, currPos.z);
            }

            if (this.node.mtxLocal.translation.y + agentRadius > 14.75) {
                //console.log("+y");
                this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x, -14.75 + agentRadius, currPos.z);
            }
            if (this.node.mtxLocal.translation.y - agentRadius < -14.75) {
                //console.log("-y");
                this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x, 14.75 - agentRadius, currPos.z);
            }
        }

        public altMovement = (_event: Event) => {

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && !this.jumping) {
                this.jumping = true;
                this.jump();
                console.log("jump!");

            }

            let deltaTime: number = ƒ.Loop.timeFrameReal / 1000

            let speedAgentTranslation: number = 10; // meters per second

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {

                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                    this.node.mtxLocal.translateZ((speedAgentTranslation * deltaTime * 2) / 3)
                } else {
                    this.node.mtxLocal.translateZ(speedAgentTranslation * deltaTime)
                }

            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {

                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                    this.node.mtxLocal.translateZ((-speedAgentTranslation * deltaTime * 2) / 3)
                } else {
                    this.node.mtxLocal.translateZ(-speedAgentTranslation * deltaTime)
                }

            }

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {

                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                    this.node.mtxLocal.translateX((-speedAgentTranslation * deltaTime * 2) / 3)
                } else {
                    this.node.mtxLocal.translateX(-speedAgentTranslation * deltaTime)
                }


            }

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {

                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                    this.node.mtxLocal.translateX((speedAgentTranslation * deltaTime * 2) / 3)
                } else {
                    this.node.mtxLocal.translateX(speedAgentTranslation * deltaTime)
                }


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
            this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x,this.jumpFunc(this.timeStamp) + 0.5,currPos.z);   
            if (this.jumpFunc(this.timeStamp) < 0) {
                this.jumping = false;
                this.timeStamp = 0;
            }
            
        }

        public jumpFunc(x: number): number {
            let result: number = -(Math.pow((x*4)-1.41,2)) + 2;
            return result;
        }
        // protected reduceMutator(_mutator: ƒ.Mutator): void {
        //   // delete properties that should not be mutated
        //   // undefined properties and private fields (#) will not be included by default
        // }
    }
}