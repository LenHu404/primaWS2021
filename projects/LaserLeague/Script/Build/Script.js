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
                            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.rotateLaser);
                            break;
                        case "componentRemove" /* COMPONENT_REMOVE */:
                            this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                            this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                            break;
                    }
                };
                this.rotateLaser = (_event) => {
                    let deltaTime = ƒ.Loop.timeFrameReal / 1000;
                    let speedLaserRotate = 120; // degrees per second
                    this.node.getChildrenByName("center")[0].mtxLocal.rotateZ(speedLaserRotate * deltaTime);
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
    let laserTransform;
    let laserArray;
    let agent;
    let laser;
    let beamWidth = 0.7;
    let agentRadius = 0.5;
    let beamHeight = 6;
    let copyLaser;
    let ctrForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    //let speedAgentTranslation: number = 10; // meters per second
    async function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        console.log("graph");
        console.log(graph);
        // console.log(graph.getChildrenByName("Agents"));
        laser = graph.getChildrenByName("Laserformations")[0].getChildrenByName("Laserblock1")[0];
        laserTransform = laser.getChildren()[0].getComponent(ƒ.ComponentTransform).mtxLocal;
        agent = graph.getChildrenByName("Agents")[0].getChildrenByName("agent1")[0];
        let graphLaser = await ƒ.Project.registerAsGraph(laser, false);
        copyLaser = await ƒ.Project.createGraphInstance(graphLaser);
        let countLaser = graph.getChildrenByName("Laserformations")[0].getChildren().length;
        console.log(countLaser);
        laserArray = new Array(countLaser);
        for (let i = 0; i < countLaser; i++) {
            laserArray[i] = graph.getChildrenByName("Laserformations")[0].getChildren()[i].getChildrenByName("center")[0].mtxLocal;
        }
        graph.getChildrenByName("Laserformations")[0].addChild(copyLaser);
        //copy.addComponent(new ƒ.ComponentTransform);
        //copy.mtxLocal.translateX(5);
        copyLaser.mtxLocal.translation = ƒ.Vector3.X(10);
        viewport.camera.mtxPivot.translateZ(-50);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        //let speedLaserRotate: number = 120; // degrees per second
        //laserTransform.rotateZ(speedLaserRotate * deltaTime);
        /* laserArray.forEach(element => {
          element.rotateZ(speedLaserRotate * deltaTime);
        }); */
        movement(_event, deltaTime);
        checkCollision();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function movement(_event, _deltaTime) {
        //let speedAgentTranslation: number = 10; // meters per second
        let speedAgentRotation = 360; // meters per second
        let value = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
            + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
        ctrForward.setInput(value * _deltaTime);
        agent.mtxLocal.translateY(ctrForward.getOutput());
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
            agent.mtxLocal.rotateZ(speedAgentRotation * _deltaTime);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
            agent.mtxLocal.rotateZ(-speedAgentRotation * _deltaTime);
    }
    function checkCollision() {
        laser.getChildren()[0].getChildren().forEach(element => {
            let beam = element;
            let posLocal = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
            //console.log(posLocal.toString()+ beam.name);
            if (posLocal.x < (-beamWidth / 2 - agentRadius) || posLocal.x > (beamWidth / 2 + agentRadius) || posLocal.y < (agentRadius) || posLocal.y > (beamHeight + agentRadius)) {
                //console.log("not intersecting");
            }
            else {
                console.log("intersecting");
            }
        });
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
//# sourceMappingURL=Script.js.map