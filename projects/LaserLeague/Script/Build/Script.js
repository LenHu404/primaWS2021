"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let CustomComponentScript = /** @class */ (() => {
        class CustomComponentScript extends ƒ.ComponentScript {
            constructor() {
                super();
                // Properties may be mutated by users in the editor via the automatically created user interface
                this.message = "CustomComponentScript added to ";
                // Activate the functions of this component as response to events
                this.hndEvent = (_event) => {
                    switch (_event.type) {
                        case "componentAdd" /* COMPONENT_ADD */:
                            ƒ.Debug.log(this.message, this.node);
                            break;
                        case "componentRemove" /* COMPONENT_REMOVE */:
                            this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                            this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                            break;
                    }
                };
                // Don't start when running in editor
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                // Listen to this component being added to or removed from a node
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            }
        }
        // Register the script as component for use in the editor via drag&drop
        CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        return CustomComponentScript;
    })();
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    // document.addEventListener("keydown", <EventListener>start);
    let transform;
    let agent;
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        console.log("graph");
        console.log(graph);
        // console.log(graph.getChildrenByName("Agents"));
        let laser = graph.getChildrenByName("Laserformations")[0].getChildrenByName("Laserblock1")[0].getChildrenByName("center")[0];
        agent = graph.getChildrenByName("Agents")[0].getChildrenByName("agent1")[0];
        transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;
        viewport.camera.mtxPivot.translateZ(-50);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        movement(_event);
        let speedLaserRotate = 120; // degrees per second
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        transform.rotateZ(speedLaserRotate * deltaTime);
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function movement(_event) {
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let speedAgentTranslation = 10; // meters per second
        //let speedAgentRotation: number = 360; // meters per second
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                agent.mtxLocal.translateY((speedAgentTranslation * deltaTime * 2) / 3);
            }
            else {
                agent.mtxLocal.translateY(speedAgentTranslation * deltaTime);
            }
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                agent.mtxLocal.translateY((-speedAgentTranslation * deltaTime * 2) / 3);
            }
            else {
                agent.mtxLocal.translateY(-speedAgentTranslation * deltaTime);
            }
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                agent.mtxLocal.translateX((speedAgentTranslation * deltaTime * 2) / 3);
            }
            else {
                agent.mtxLocal.translateX(speedAgentTranslation * deltaTime);
            }
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                agent.mtxLocal.translateX((-speedAgentTranslation * deltaTime * 2) / 3);
            }
            else {
                agent.mtxLocal.translateX(-speedAgentTranslation * deltaTime);
            }
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map