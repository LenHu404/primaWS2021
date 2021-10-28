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
    //let laserTransform: ƒ.Matrix4x4;
    let agent;
    //let laser: ƒ.Node;
    let countLaserblocks = 6;
    let laserBlocks;
    let beamWidth = 0.7;
    let agentRadius = 1;
    let beamHeight = 6;
    let copyLaser;
    let ctrForward = new ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrlRotation = new ƒ.Control("Rotation", 1, 0 /* PROPORTIONAL */);
    ctrlRotation.setDelay(50);
    //let speedAgentTranslation: number = 10; // meters per second
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        console.log("graph: ", graph);
        laserBlocks = graph.getChildrenByName("Laserformations")[0];
        agent = graph.getChildrenByName("Agents")[0].getChildrenByName("agent1")[0];
        addLaser(_event, graph);
        viewport.camera.mtxPivot.translateZ(-50);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        movement(_event, deltaTime);
        checkCollision();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function addLaser(_event, _graph) {
        let graphLaser = FudgeCore.Project.resources["Graph|2021-10-28T13:06:41.527Z|18999"]; // get the laser-ressource
        let startPos = new ƒ.Vector2(-15, -8);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < countLaserblocks / 2; j++) {
                copyLaser = await ƒ.Project.createGraphInstance(graphLaser);
                copyLaser.mtxLocal.translation = new ƒ.Vector3(startPos.x + j * 15, startPos.y + i * 16, 0);
                _graph.getChildrenByName("Laserformations")[0].addChild(copyLaser);
                copyLaser.getComponent(Script.laserRotatorScript).speedLaserRotate = ƒ.random.getRange(90, 150);
                if (i > 0) {
                    copyLaser.getComponent(Script.laserRotatorScript).speedLaserRotate *= -1;
                }
            }
        }
    }
    function movement(_event, _deltaTime) {
        let speedAgentTranslation = 10; // meters per second
        let speedAgentRotation = 360; // meters per second
        let speedValue = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
            + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
        ctrForward.setInput(speedValue * _deltaTime);
        agent.mtxLocal.translateY(ctrForward.getOutput() * speedAgentTranslation);
        let rotationValue = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
            + (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));
        ctrlRotation.setInput(rotationValue * _deltaTime);
        agent.mtxLocal.rotateZ(ctrlRotation.getOutput() * speedAgentRotation);
        /* if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
          agent.mtxLocal.rotateZ(speedAgentRotation * _deltaTime);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
          agent.mtxLocal.rotateZ(-speedAgentRotation * _deltaTime); */
        let currPos = agent.mtxLocal.translation;
        //console.log(agent.mtxLocal.translation.toString());
        if (agent.mtxLocal.translation.x + agentRadius > 25) {
            console.log("+x");
            agent.mtxLocal.translation = new ƒ.Vector3(-25 + agentRadius, currPos.y, currPos.z);
        }
        if (agent.mtxLocal.translation.x - agentRadius < -25) {
            console.log("-x");
            agent.mtxLocal.translation = new ƒ.Vector3(25 - agentRadius, currPos.y, currPos.z);
        }
        if (agent.mtxLocal.translation.y + agentRadius > 15) {
            console.log("+y");
            agent.mtxLocal.translation = new ƒ.Vector3(currPos.x, -15 + agentRadius, currPos.z);
        }
        if (agent.mtxLocal.translation.y - agentRadius < -15) {
            console.log("+y");
            agent.mtxLocal.translation = new ƒ.Vector3(currPos.x, 15 - agentRadius, currPos.z);
        }
    }
    function checkCollision() {
        for (let i = 0; i < laserBlocks.getChildren().length; i++) {
            laserBlocks.getChildren()[i].getChildren()[0].getChildren().forEach(element => {
                let beam = element;
                let posLocal = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
                //console.log(posLocal.toString()+ beam.name);
                if (posLocal.x < (-beamWidth / 2 - agentRadius) || posLocal.x > (beamWidth / 2 + agentRadius) || posLocal.y < (agentRadius) || posLocal.y > (beamHeight + agentRadius)) {
                    //console.log("not intersecting");
                }
                else {
                    console.log("intersecting");
                    agent.mtxLocal.translation = new ƒ.Vector3(0, 0, 0);
                }
            });
        }
    }
    /* function altMovement(_event: Event): void {
  
      let deltaTime: number = ƒ.Loop.timeFrameReal / 1000
  
      let speedAgentTranslation: number = 10; // meters per second
  
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
  
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
          agent.mtxLocal.translateY((speedAgentTranslation * deltaTime * 2) / 3)
        } else {
          agent.mtxLocal.translateY(speedAgentTranslation * deltaTime)
        }
  
      }
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
  
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
          agent.mtxLocal.translateY((-speedAgentTranslation * deltaTime * 2) / 3)
        } else {
          agent.mtxLocal.translateY(-speedAgentTranslation * deltaTime)
        }
  
      }
  
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
  
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
          agent.mtxLocal.translateX((speedAgentTranslation * deltaTime * 2) / 3)
        } else {
          agent.mtxLocal.translateX(speedAgentTranslation * deltaTime)
        }
  
  
      }
  
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
  
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
          agent.mtxLocal.translateX((-speedAgentTranslation * deltaTime * 2) / 3)
        } else {
          agent.mtxLocal.translateX(-speedAgentTranslation * deltaTime)
        }
  
  
      }
    } */
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let laserRotatorScript = /** @class */ (() => {
        class laserRotatorScript extends ƒ.ComponentScript {
            constructor() {
                super();
                // Properties may be mutated by users in the editor via the automatically created user interface
                this.message = "laserRotatorScript added to ";
                this.speedLaserRotate = 120; // degrees per second
                // Activate the functions of this component as response to events
                this.hndEvent = (_event) => {
                    switch (_event.type) {
                        case "componentAdd" /* COMPONENT_ADD */:
                            ƒ.Debug.log(this.message, this.node);
                            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                            break;
                        case "componentRemove" /* COMPONENT_REMOVE */:
                            this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                            this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                            break;
                    }
                };
                this.update = (_event) => {
                    let deltaTime = ƒ.Loop.timeFrameReal / 1000;
                    this.node.getChildrenByName("center")[0].mtxLocal.rotateZ(this.speedLaserRotate * deltaTime);
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
        laserRotatorScript.iSubclass = ƒ.Component.registerSubclass(laserRotatorScript);
        return laserRotatorScript;
    })();
    Script.laserRotatorScript = laserRotatorScript;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map