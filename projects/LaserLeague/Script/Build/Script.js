"use strict";
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        constructor() {
            super("Agent");
            /* this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad("MeshAgnt")));
            this.addComponent(new ƒ.ComponentMaterial(
                new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1))))
            );
            this.mtxLocal.translateZ(1); */
            //this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(ƒ.Vector3.ONE(0.5));
            //this.addComponent(new agentComponentScript());
            this.createAgent();
        }
        async createAgent() {
            let agentBlueprint = FudgeCore.Project.resources["Graph|2021-11-03T17:02:45.274Z|68116"];
            let startPos = new ƒ.Vector3(0, 0, 0.5);
            let agentInstance = await ƒ.Project.createGraphInstance(agentBlueprint);
            agentInstance.mtxLocal.translation = startPos;
            this.addChild(agentInstance);
        }
    }
    LaserLeague.Agent = Agent;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(LaserLeague); // Register the namespace to FUDGE for serialization
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
    LaserLeague.CustomComponentScript = CustomComponentScript;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
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
    /* let beamWidth: number = 6;
    let beamHeight: number = 0.7;
    let agentRadius: number = 1; */
    let copyLaser;
    let ctrForward = new ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrlRotation = new ƒ.Control("Rotation", 1, 0 /* PROPORTIONAL */);
    ctrlRotation.setDelay(50);
    //let speedAgentTranslation: number = 10; // meters per second
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        //agent = graph.getChildrenByName("Agents")[0].getChildrenByName("agent1")[0];
        laserBlocks = graph.getChildrenByName("Laserformations")[0];
        agent = new LaserLeague.Agent();
        graph.getChildrenByName("Agents")[0].addChild(agent);
        addLaser(_event, graph);
        viewport.camera.mtxPivot.translateZ(-50);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        console.log("graph: ", graph);
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
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
                copyLaser.getComponent(LaserLeague.laserRotatorScript).speedLaserRotate = ƒ.random.getRange(90, 150);
                if (i > 0) {
                    copyLaser.getComponent(LaserLeague.laserRotatorScript).speedLaserRotate *= -1;
                }
            }
        }
    }
    function checkCollision() {
        let _agent = agent.getChildren()[0];
        for (let i = 0; i < laserBlocks.getChildren().length; i++) {
            laserBlocks.getChildren()[i].getChildren()[0].getChildren().forEach(element => {
                let beam = element;
                let posLocal = ƒ.Vector3.TRANSFORMATION(_agent.mtxWorld.translation, beam.mtxWorldInverse, true);
                let x = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + _agent.radius / 2;
                let y = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + _agent.radius / 2;
                if (posLocal.x <= (x) && posLocal.x >= -(x) && posLocal.y <= y && posLocal.y >= 0) {
                    console.log("intersecting");
                    _agent.getComponent(LaserLeague.agentComponentScript).respawn();
                }
            });
        }
    }
})(LaserLeague || (LaserLeague = {}));
/* function checkCollisionALT(): void {
    let _agent: ƒ.Node = agent.getChildren()[0];

    for (let i = 0; i < laserBlocks.getChildren().length; i++) {

      laserBlocks.getChildren()[i].getChildren()[0].getChildren().forEach(element => {
        let beam: ƒ.Node = element;
        let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_agent.mtxWorld.translation, beam.mtxWorldInverse, true);
        let maxX: number = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x + _agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2;
        let minX: number = - beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x + _agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2;
        let maxY: number = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y / 2 - _agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2;
        let minY: number = - beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + _agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2;

        if (i = 0) {
          console.log(posLocal);
        }
        if (posLocal.x > minX && posLocal.x < maxX && posLocal.y > maxY && posLocal.y < minY) {
          console.log("intersecting");
          _agent.getComponent(agentComponentScript).respawn();

        } else {
          //console.log("not intersecting");
        }
      });
    }



  } */ 
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(LaserLeague); // Register the namespace to FUDGE for serialization
    let agentComponentScript = /** @class */ (() => {
        class agentComponentScript extends ƒ.ComponentScript {
            constructor() {
                super();
                // Properties may be mutated by users in the editor via the automatically created user interface
                this.message = "agentComponentScript added to ";
                this.ctrForward = new ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */);
                this.ctrlRotation = new ƒ.Control("Rotation", 1, 0 /* PROPORTIONAL */);
                this.agentDiameter = 2;
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
                    this.movement(_event);
                };
                this.respawn = () => {
                    this.node.mtxLocal.translation = new ƒ.Vector3(0, 0, 1);
                    this.ctrForward.setDelay(0);
                    this.ctrForward.setInput(0);
                    this.ctrlRotation.setInput(0);
                    this.ctrForward.setDelay(200);
                    this.node.mtxLocal.rotation = new ƒ.Vector3(0, 0, 0);
                };
                this.movement = (_event) => {
                    let deltaTime = ƒ.Loop.timeFrameReal / 1000;
                    let speedAgentTranslation = 10; // meters per second
                    let speedAgentRotation = 360; // meters per second
                    let speedValue = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
                        + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
                    this.ctrForward.setInput(speedValue * deltaTime);
                    this.node.mtxLocal.translateY(this.ctrForward.getOutput() * speedAgentTranslation);
                    let rotationValue = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                        + (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));
                    this.ctrlRotation.setInput(rotationValue * deltaTime);
                    this.node.mtxLocal.rotateZ(this.ctrlRotation.getOutput() * speedAgentRotation);
                    let currPos = this.node.mtxLocal.translation;
                    //console.log(agent.mtxLocal.translation.toString());
                    if (this.node.mtxLocal.translation.x + this.agentDiameter / 2 > 25) {
                        console.log("+x");
                        this.node.mtxLocal.translation = new ƒ.Vector3(-25 + this.agentDiameter / 2, currPos.y, currPos.z);
                    }
                    if (this.node.mtxLocal.translation.x - this.agentDiameter / 2 < -25) {
                        console.log("-x");
                        this.node.mtxLocal.translation = new ƒ.Vector3(25 - this.agentDiameter / 2, currPos.y, currPos.z);
                    }
                    if (this.node.mtxLocal.translation.y + this.agentDiameter / 2 > 15) {
                        console.log("+y");
                        this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x, -15 + this.agentDiameter / 2, currPos.z);
                    }
                    if (this.node.mtxLocal.translation.y - this.agentDiameter / 2 < -15) {
                        console.log("-y");
                        this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x, 15 - this.agentDiameter / 2, currPos.z);
                    }
                };
                this.ctrForward.setDelay(200);
                this.ctrlRotation.setDelay(50);
                // Don't start when running in editor
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                // Listen to this component being added to or removed from a node
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            }
        }
        // Register the script as component for use in the editor via drag&drop
        agentComponentScript.iSubclass = ƒ.Component.registerSubclass(LaserLeague.CustomComponentScript);
        return agentComponentScript;
    })();
    LaserLeague.agentComponentScript = agentComponentScript;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(LaserLeague); // Register the namespace to FUDGE for serialization
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
    LaserLeague.laserRotatorScript = laserRotatorScript;
})(LaserLeague || (LaserLeague = {}));
//# sourceMappingURL=Script.js.map