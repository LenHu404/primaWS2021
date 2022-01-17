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
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        constructor() {
            super();
            this.name = "Run Forest Run";
            this.health = 100;
            this.score = 0;
            this.gameRunning = false;
            this.lapRunning = false;
            let domHud = document.querySelector("#Hud");
            GameState.instance = this;
            GameState.controller = new ƒui.Controller(this, domHud);
            console.log("Hud-Controller", GameState.controller);
        }
        static get() {
            return GameState.instance || new GameState();
        }
        reduceMutator(_mutator) { }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let LaeuferScript = /** @class */ (() => {
        class LaeuferScript extends ƒ.ComponentScript {
            constructor() {
                super();
                // Properties may be mutated by users in the editor via the automatically created user interface
                this.message = "LaeuferScript added to ";
                this.ctrForward = new ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */);
                this.ctrlRotation = new ƒ.Control("Rotation", 1, 0 /* PROPORTIONAL */);
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
                    this.altMovement(_event);
                };
                this.movement = (_event) => {
                    let deltaTime = ƒ.Loop.timeFrameReal / 1000;
                    let speedAgentTranslation = 10; // meters per second
                    let speedAgentRotation = 360; // meters per second
                    let speedValue = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
                        + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
                    this.ctrForward.setInput(speedValue * deltaTime);
                    this.node.mtxLocal.translateX(this.ctrForward.getOutput() * speedAgentTranslation);
                    let rotationValue = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                        + (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));
                    this.ctrlRotation.setInput(rotationValue * deltaTime);
                    this.node.mtxLocal.rotateY(this.ctrlRotation.getOutput() * speedAgentRotation);
                    let agentRadius = this.node.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2;
                    //let groundScale: ƒ.Vector2 = new ƒ.Vector2()
                    let currPos = this.node.mtxLocal.translation;
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
                };
                this.altMovement = (_event) => {
                    let deltaTime = ƒ.Loop.timeFrameReal / 1000;
                    let speedAgentTranslation = 10; // meters per second
                    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
                        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                            this.node.mtxLocal.translateZ((speedAgentTranslation * deltaTime * 2) / 3);
                        }
                        else {
                            this.node.mtxLocal.translateZ(speedAgentTranslation * deltaTime);
                        }
                    }
                    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                            this.node.mtxLocal.translateZ((-speedAgentTranslation * deltaTime * 2) / 3);
                        }
                        else {
                            this.node.mtxLocal.translateZ(-speedAgentTranslation * deltaTime);
                        }
                    }
                    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
                        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                            this.node.mtxLocal.translateX((-speedAgentTranslation * deltaTime * 2) / 3);
                        }
                        else {
                            this.node.mtxLocal.translateX(-speedAgentTranslation * deltaTime);
                        }
                    }
                    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                            this.node.mtxLocal.translateX((speedAgentTranslation * deltaTime * 2) / 3);
                        }
                        else {
                            this.node.mtxLocal.translateX(speedAgentTranslation * deltaTime);
                        }
                    }
                    let currPos = this.node.mtxLocal.translation;
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
        LaeuferScript.iSubclass = ƒ.Component.registerSubclass(LaeuferScript);
        return LaeuferScript;
    })();
    Script.LaeuferScript = LaeuferScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    window.addEventListener("load", start);
    let graph;
    let runner;
    let floor;
    let matFloor;
    let band;
    let obstacles;
    let metercount = 0;
    async function start(_event) {
        await ƒ.Project.loadResourcesFromHTML();
        graph = ƒ.Project.resources["Graph|2022-01-06T13:14:39.351Z|61391"];
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.rotateY(25);
        cmpCamera.mtxPivot.translateZ(-17);
        cmpCamera.mtxPivot.translateY(5);
        cmpCamera.mtxPivot.translateX(2);
        cmpCamera.mtxPivot.rotateX(10);
        graph.addComponent(cmpCamera);
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        floor = graph.getChildrenByName("Laufband")[0].getChildrenByName("Boden")[0];
        matFloor = floor.getComponent(ƒ.ComponentMaterial);
        band = graph.getChildrenByName("Laufband")[0].getChildrenByName("Band")[0];
        runner = graph.getChildrenByName("Laeufer")[0];
        obstacles = graph.getChildrenByName("Laufband")[0].getChildrenByName("Band")[0].getChildrenByName("Hindernisse")[0];
        runner.getComponent(ƒ.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, hndCollision, true);
        instaniateObstacles();
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        ƒ.Physics.adjustTransforms(graph);
        ƒ.AudioManager.default.listenTo(graph);
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        ƒ.Physics.world.simulate(Math.min(0.1, deltaTime)); // if physics is included and used
        deleteUnseemObstacle();
        if (Script.GameState.get().gameRunning) {
            document.querySelector("#info").setAttribute("hidden", "true");
            //instaniateObstacles();
            matFloor.mtxPivot.translateX(0.05 * deltaTime);
            band.mtxLocal.translateZ(-1 * deltaTime);
            metercount += -1 * deltaTime;
            Script.GameState.get().score = (-metercount * 100).toFixed(0);
        }
        else if (!Script.GameState.get().gameRunning) {
            startGame();
            document.querySelector("#info").removeAttribute("hidden");
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])) {
            instaniateObstacles();
        }
        //console.log("metercount", metercount);
        //matFloor.mtxPivot.translation.x += 0.01* deltaTime;
        // matFloor.mtxPivot.rotation +=1
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function instaniateObstacles() {
        let treeBlueprint = FudgeCore.Project.resources["Graph|2022-01-11T13:55:44.114Z|12001"];
        let startPos = new ƒ.Vector3(0, 0, -metercount + 4);
        let treeInstance = await ƒ.Project.createGraphInstance(treeBlueprint);
        treeInstance.mtxLocal.translation = startPos;
        obstacles.addChild(treeInstance);
        let StoneBlueprint = FudgeCore.Project.resources["Graph|2022-01-11T13:55:46.329Z|17331"];
        startPos = new ƒ.Vector3(3, 0, -metercount + 6);
        let stoneInstance = await ƒ.Project.createGraphInstance(StoneBlueprint);
        stoneInstance.mtxLocal.translation = startPos;
        obstacles.addChild(stoneInstance);
        let treeStumpBlueprint = FudgeCore.Project.resources["Graph|2022-01-11T13:55:41.283Z|27993"];
        startPos = new ƒ.Vector3(-2, 0, -metercount + 15);
        let treeStumpInstance = await ƒ.Project.createGraphInstance(treeStumpBlueprint);
        treeStumpInstance.mtxLocal.translation = startPos;
        obstacles.addChild(treeStumpInstance);
    }
    async function instaniateTree() {
        let treeBlueprint = FudgeCore.Project.resources["Graph|2022-01-11T13:55:44.114Z|12001"];
        let startPos = new ƒ.Vector3(3, 0, -metercount + 4);
        let treeInstance = await ƒ.Project.createGraphInstance(treeBlueprint);
        treeInstance.mtxLocal.translation = startPos;
        obstacles.addChild(treeInstance);
    }
    function startGame() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ENTER])) {
            Script.GameState.get().gameRunning = true;
        }
    }
    function hndCollision(_event) {
        //console.log("called");
        if (Script.GameState.get().gameRunning) {
            let obstacle = _event.cmpRigidbody.node;
            console.log(obstacle.name);
            if (obstacle.getParent().name != "Hindernisse") {
                obstacle = obstacle.getParent();
            }
            for (const node of obstacle.getIterator()) {
                if (node.getComponent(ƒ.ComponentRigidbody)) {
                    node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
                }
                node.activate(false);
            }
            obstacles.removeChild(obstacle);
            //reset();
            Script.GameState.get().health -= 1;
            //console.log( GameState.get().health);
        }
    }
    function deleteUnseemObstacle() {
        obstacles.getChildren().forEach(obstacle => {
            //console.log(obstacle.name, obstacle.mtxWorld.translation.z);
            if (obstacle.mtxWorld.translation.z < -10) {
                for (const node of obstacle.getIterator()) {
                    if (node.getComponent(ƒ.ComponentRigidbody)) {
                        node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
                    }
                    node.activate(false);
                }
                obstacles.removeChild(obstacle);
                //console.log("graph", obstacles);
            }
        });
    }
    function reset() {
        obstacles.getChildren().forEach(obstacle => {
            //console.log(obstacle.name, obstacle.mtxWorld.translation.z);
            if (obstacle.mtxWorld.translation.z > -5 && obstacle.mtxWorld.translation.z < 5) {
                for (const node of obstacle.getIterator()) {
                    if (node.getComponent(ƒ.ComponentRigidbody)) {
                        node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
                    }
                    node.activate(false);
                }
                obstacles.removeChild(obstacle);
                //console.log("graph", obstacles);
            }
        });
        runner.mtxLocal.translation = new ƒ.Vector3(0, 0, 0);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map