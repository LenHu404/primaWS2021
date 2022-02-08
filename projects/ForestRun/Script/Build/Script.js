"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let CoinScript = /** @class */ (() => {
        class CoinScript extends ƒ.ComponentScript {
            constructor() {
                super();
                // Properties may be mutated by users in the editor via the automatically created user interface
                this.message = "CoinScript added to ";
                this.timeStamp = 0;
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
                    this.node.mtxLocal.rotateY(180 * deltaTime);
                    this.timeStamp += 1 * deltaTime;
                    let currPos = this.node.mtxLocal.translation;
                    this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x, this.sin(this.timeStamp) + 0.5, currPos.z);
                    //console.log("sin", this.sin(this.timeStamp));
                };
                // Don't start when running in editor
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                // Listen to this component being added to or removed from a node
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            }
            sin(x) {
                return Math.sin(Math.PI * x) * 0.3;
            }
        }
        // Register the script as component for use in the editor via drag&drop
        CoinScript.iSubclass = ƒ.Component.registerSubclass(CoinScript);
        return CoinScript;
    })();
    Script.CoinScript = CoinScript;
})(Script || (Script = {}));
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
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class Datafile {
        constructor() {
            this.getData();
        }
        save() {
            let data = {
                "hscore": Script.GameState.get().hScore
            };
            let jdata = JSON.stringify(data);
            fs_1.default.writeFile('data.json', jdata, (err) => {
                if (err) {
                    throw err;
                }
                console.log("JSON data is saved.");
            });
        }
        getData() {
            fs_1.default.readFile('data.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }
                Script.GameState.get().hScore = JSON.parse(data.toString());
            });
        }
    }
    Script.Datafile = Datafile;
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
            this.hScore = 0;
            this.gameRunning = false;
            this.lapRunning = false;
            this.health1 = true;
            this.health2 = true;
            this.health3 = true;
            let domHud = document.querySelector("#Hud");
            GameState.instance = this;
            GameState.controller = new ƒui.Controller(this, domHud);
            console.log("Hud-Controller", GameState.controller);
        }
        static get() {
            return GameState.instance || new GameState();
        }
        setHealth() {
            if (this.health1) {
                document.querySelector("#health1").removeAttribute("style");
            }
            else {
                document.querySelector("#health1").setAttribute("style", "display:none");
            }
            if (this.health2) {
                document.querySelector("#health2").removeAttribute("style");
            }
            else {
                document.querySelector("#health2").setAttribute("style", "display:none");
            }
            if (this.health3) {
                document.querySelector("#health3").removeAttribute("style");
            }
            else {
                document.querySelector("#health3").setAttribute("style", "display:none");
            }
        }
        hit() {
            if (this.health3) {
                this.health3 = false;
                this.setHealth();
                return 2;
            }
            else if (this.health2) {
                this.health2 = false;
                this.setHealth();
                return 1;
            }
            else {
                this.health1 = false;
                this.setHealth();
                return 0;
            }
        }
        reduceMutator(_mutator) { }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let MoveState;
    (function (MoveState) {
        MoveState[MoveState["forward"] = 0] = "forward";
        MoveState[MoveState["backwards"] = 1] = "backwards";
        MoveState[MoveState["idle"] = 2] = "idle";
    })(MoveState || (MoveState = {}));
    let LaeuferScript = /** @class */ (() => {
        class LaeuferScript extends ƒ.ComponentScript {
            constructor() {
                super();
                // Properties may be mutated by users in the editor via the automatically created user interface
                this.message = "LaeuferScript added to ";
                this.jumping = false;
                this.timeStamp = 0;
                this.ctrForward = new ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */);
                this.ctrlRotation = new ƒ.Control("Rotation", 1, 0 /* PROPORTIONAL */);
                // Activate the functions of this component as response to events
                this.hndEvent = (_event) => {
                    switch (_event.type) {
                        case "componentAdd" /* COMPONENT_ADD */:
                            ƒ.Debug.log(this.message, this.node);
                            //this.start();
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
                    if (Script.GameState.get().gameRunning)
                        this.altMovement(_event);
                    if (this.jumping)
                        this.timeStamp += 1 * deltaTime;
                    this.jump();
                    //console.log("timeStamp", this.timeStamp);
                    //console.log("jumpY", this.jumpFunc(this.timeStamp));
                    // console.log("math: ", Math.pow(0-2,2));
                };
                this.start = () => {
                    console.log("name ", this.node);
                    this.body = this.node.getChild(0);
                    console.log("name ", this.body);
                    this.head = this.node.getChildrenByName("body")[0].getChildrenByName("head")[0];
                    this.lLeg = this.node.getChildrenByName("body")[0].getChildrenByName("lLeg")[0];
                    this.rLeg = this.node.getChildrenByName("body")[0].getChildrenByName("rLeg")[0];
                    this.lArm = this.node.getChildrenByName("body")[0].getChildrenByName("lArm")[0];
                    this.rArm = this.node.getChildrenByName("body")[0].getChildrenByName("rArm")[0];
                };
                this.altMovement = (_event) => {
                    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && !this.jumping) {
                        this.jumping = true;
                        this.jump();
                        console.log("jump!");
                    }
                    let deltaTime = ƒ.Loop.timeFrameReal / 1000;
                    let speedAgentTranslation = 10;
                    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
                        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                            this.node.mtxLocal.translateZ((speedAgentTranslation * deltaTime * 2) / 3);
                        }
                        else {
                            this.node.mtxLocal.translateZ(speedAgentTranslation * deltaTime);
                            this.node.mtxLocal.rotation = new ƒ.Vector3(0, 0, 0);
                        }
                        this.moving = MoveState.forward;
                    }
                    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                            this.node.mtxLocal.translateZ((-speedAgentTranslation * deltaTime * 2) / 3);
                        }
                        else {
                            this.node.mtxLocal.translateZ(-speedAgentTranslation * deltaTime);
                            this.node.mtxLocal.rotation = new ƒ.Vector3(0, 0, 0);
                        }
                        this.moving = MoveState.backwards;
                    }
                    else {
                        this.node.mtxLocal.rotation = new ƒ.Vector3(0, 0, 0);
                        this.moving = MoveState.idle;
                    }
                    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
                        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                            this.node.mtxLocal.translateX((-speedAgentTranslation * deltaTime * 2) / 3);
                        }
                        else {
                            this.node.mtxLocal.translateX(-speedAgentTranslation * deltaTime);
                        }
                        this.node.mtxLocal.rotation = new ƒ.Vector3(0, -30, 0);
                    }
                    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                            this.node.mtxLocal.translateX((speedAgentTranslation * deltaTime * 2) / 3);
                        }
                        else {
                            this.node.mtxLocal.translateX(speedAgentTranslation * deltaTime);
                        }
                        this.node.mtxLocal.rotation = new ƒ.Vector3(0, 30, 0);
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
            jump() {
                //console.log("timeStamp", this.timeStamp);
                //console.log("jumpY", this.jumpFunc(this.timeStamp));
                let currPos = this.node.mtxLocal.translation;
                this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x, this.jumpFunc(this.timeStamp) + 0.75, currPos.z);
                if (this.jumpFunc(this.timeStamp) < 0) {
                    this.jumping = false;
                    this.timeStamp = 0;
                }
            }
            jumpFunc(x) {
                let result = -(Math.pow((x * 4) - 1.41, 2)) + 2;
                return result;
            }
            sin(x) {
                return Math.sin(Math.PI * x);
            }
            animation() {
                let rotation = this.map_range(this.sin(this.timeStamp), 1, 0, -20, 20);
                if (this.moving == MoveState.forward) {
                    this.lLeg.mtxLocal.rotation = new ƒ.Vector3(rotation, 0, 0);
                    this.rLeg.mtxLocal.rotation = new ƒ.Vector3(-rotation, 0, 0);
                    this.lArm.mtxLocal.rotation = new ƒ.Vector3(-rotation, 0, 0);
                    this.rArm.mtxLocal.rotation = new ƒ.Vector3(rotation, 0, 0);
                }
            }
            map_range(v, from_min, from_max, to_min, to_max) {
                return to_min + (v - from_min) * (to_max - to_min) / (from_max - from_min);
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
    let MoveState;
    (function (MoveState) {
        MoveState[MoveState["forward"] = 0] = "forward";
        MoveState[MoveState["backwards"] = 1] = "backwards";
        MoveState[MoveState["idle"] = 2] = "idle";
    })(MoveState || (MoveState = {}));
    let viewport;
    //document.addEventListener("interactiveViewportStarted", <EventListener>start);
    window.addEventListener("load", start);
    let graph;
    let runner;
    let floor1;
    let floor2;
    let sub1;
    let sub2;
    let matFloor1;
    let matFloor2;
    let matSub1;
    let matSub2;
    let band;
    let obstacles;
    let metercount = 0;
    let obstacleDistance = 5;
    let lastObstacleSpawnDistance = 0;
    let lastObstacleSpawn = 0;
    let speed = 4;
    let startPoint = 30;
    let body;
    //let head: ƒ.Node;
    let lLeg;
    let rLeg;
    let lArm;
    let rArm;
    let moving;
    let timeStamp = 0;
    let bgMusic;
    let bgMusicPlayig;
    //let dataFile : Datafile;
    async function start(_event) {
        await ƒ.Project.loadResourcesFromHTML();
        graph = ƒ.Project.resources["Graph|2022-01-06T13:14:39.351Z|61391"];
        initiateCamera();
        getNodesFromGraph();
        // Add collisionhandling to runner-Node 
        runner.getComponent(ƒ.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, hndCollision, true);
        // Get Data from File or localStorage
        //dataFile = new Datafile();
        //dataFile.getData();
        if (localStorage.getItem("HScore")) {
            Script.GameState.get().hScore = JSON.parse(localStorage.getItem("HScore"));
        }
        moving = MoveState.forward;
        //instaniateObstacles();
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        ƒ.Physics.adjustTransforms(graph);
        ƒ.AudioManager.default.listenTo(graph);
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        bgMusic = getcmpAudio("sndBgMusic");
    }
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        ƒ.Physics.world.simulate(Math.min(0.1, deltaTime)); // if physics is included and used
        deleteUnseenObstacle();
        if (Script.GameState.get().gameRunning) {
            document.querySelector("#info").setAttribute("hidden", "true");
            //instaniateObstacles();
            matFloor1.mtxPivot.translateX(0.075 * deltaTime * speed);
            matFloor2.mtxPivot.translateX(0.075 * deltaTime * speed);
            matSub1.mtxPivot.translateX(0.025 * deltaTime * speed);
            matSub2.mtxPivot.translateX(-0.025 * deltaTime * speed);
            band.mtxLocal.translateZ(-1.5 * deltaTime * speed);
            metercount += 1.5 * deltaTime * speed;
            timeStamp += 1 * deltaTime;
            //console.log("timestamp", metercount);
            animation();
            Script.GameState.get().score += 1;
            spawingObstacles();
            speed += 0.001;
        }
        else if (!Script.GameState.get().gameRunning) {
            startGame();
            document.querySelector("#info").removeAttribute("hidden");
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])) {
            instaniateObstacles();
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.M])) {
            bgMusicPlayig = !bgMusicPlayig;
        }
        bgMusic.play(bgMusicPlayig);
        //console.log("metercount", metercount);
        //matFloor.mtxPivot.translation.x += 0.01* deltaTime;
        // matFloor.mtxPivot.rotation +=1
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function startGame() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ENTER])) {
            Script.GameState.get().gameRunning = true;
            Script.GameState.get().score = 0;
            Script.GameState.get().health1 = true;
            Script.GameState.get().health2 = true;
            Script.GameState.get().health3 = true;
            Script.GameState.get().setHealth();
            obstacleDistance = 5;
            band.mtxLocal.translation = new ƒ.Vector3(0, 0, 0);
            metercount = 0;
            lastObstacleSpawnDistance = 0;
            lastObstacleSpawn = 0;
            speed = 4;
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
            if (obstacle.name == "Coin") {
                console;
                Script.GameState.get().score += 10000;
                let cmpAudio = getcmpAudio("sndGoldcoin");
                cmpAudio.play(true);
            }
            else {
                let cmpAudio = getcmpAudio("sndHit");
                cmpAudio.play(true);
                reset();
                if (Script.GameState.get().hit() == 0) {
                    document.getElementById("info").innerHTML = "Game over! <br> Try again and press Enter to start the Game.";
                    Script.GameState.get().gameRunning = false;
                    console.log("Score: " + Script.GameState.get().score);
                    //dataFile.save();
                    if (Script.GameState.get().score > Script.GameState.get().hScore) {
                        Script.GameState.get().hScore = Script.GameState.get().score;
                        localStorage.setItem("HScore", JSON.stringify(Script.GameState.get().score));
                    }
                }
            }
            //console.log( GameState.get().health);
        }
    }
    function deleteUnseenObstacle() {
        obstacles.getChildren().forEach(obstacle => {
            //console.log(obstacle.name, obstacle.mtxWorld.translation.z);
            if (obstacle.name == "Tree" && obstacle.mtxWorld.translation.z < runner.mtxLocal.translation.z) {
                for (const node of obstacle.getIterator()) {
                    if (node.getComponent(ƒ.ComponentMaterial)) {
                        node.getComponent(ƒ.ComponentMaterial).sortForAlpha = true;
                        node.getComponent(ƒ.ComponentMaterial).clrPrimary.a = 0.2;
                    }
                }
            }
        });
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
            if (obstacle.mtxWorld.translation.z > -5 && obstacle.mtxWorld.translation.z < 15) {
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
        runner.mtxLocal.translation = new ƒ.Vector3(0, 0.75, -3);
    }
    function spawingObstacles() {
        if (lastObstacleSpawnDistance >= obstacleDistance) {
            let randomObstacle = Math.random();
            if (randomObstacle < 0.15) {
                instaniateTree();
            }
            else if (randomObstacle > 0.8) {
                instaniateStump();
            }
            else {
                instaniateStone();
            }
            //instaniateObstacles()
            lastObstacleSpawnDistance = 0;
            lastObstacleSpawn = metercount;
            if (obstacleDistance > 2.5)
                obstacleDistance -= 0.01;
        }
        else
            lastObstacleSpawnDistance = metercount - lastObstacleSpawn;
        if (Math.random() > 0.9) {
            if (Math.random() > 0.9) {
                if (Math.random() > 0.9) {
                    instaniateCoin();
                }
            }
        }
    }
    function initiateCamera() {
        let cmpCamera = new ƒ.ComponentCamera();
        //cmpCamera.mtxPivot.rotateY(25);
        //cmpCamera.mtxPivot.translateZ(-17);
        //cmpCamera.mtxPivot.translateY(5);
        //cmpCamera.mtxPivot.translateX(2);
        cmpCamera.mtxPivot.translateY(8);
        cmpCamera.mtxPivot.translateZ(-17);
        cmpCamera.mtxPivot.rotateX(13);
        cmpCamera.mtxPivot.rotateX(10);
        graph.addComponent(cmpCamera);
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
    }
    function getNodesFromGraph() {
        floor1 = graph.getChildrenByName("Laufband")[0].getChildrenByName("Boden")[0];
        floor2 = graph.getChildrenByName("Laufband")[0].getChildrenByName("Boden")[1];
        sub1 = graph.getChildrenByName("SkyBox")[0].getChildrenByName("WestSub")[0];
        sub2 = graph.getChildrenByName("SkyBox")[0].getChildrenByName("OstSub")[0];
        matFloor1 = floor1.getComponent(ƒ.ComponentMaterial);
        matFloor2 = floor2.getComponent(ƒ.ComponentMaterial);
        matSub1 = sub1.getComponent(ƒ.ComponentMaterial);
        matSub2 = sub2.getComponent(ƒ.ComponentMaterial);
        band = graph.getChildrenByName("Laufband")[0].getChildrenByName("Band")[0];
        runner = graph.getChildrenByName("runner")[0];
        //console.log("name ", this.node);
        body = runner.getChildrenByName("body")[0];
        //console.log("name ", this.body);
        //head = body.getChildrenByName("head")[0];
        lLeg = body.getChildrenByName("lLeg")[0];
        rLeg = body.getChildrenByName("rLeg")[0];
        lArm = body.getChildrenByName("lArm")[0];
        rArm = body.getChildrenByName("rArm")[0];
        obstacles = graph.getChildrenByName("Laufband")[0].getChildrenByName("Band")[0].getChildrenByName("Hindernisse")[0];
    }
    async function instaniateObstacles() {
        let treeBlueprint = FudgeCore.Project.resources["Graph|2022-01-11T13:55:44.114Z|12001"];
        let startPos = new ƒ.Vector3(0, 0, metercount + 4);
        let treeInstance = await ƒ.Project.createGraphInstance(treeBlueprint);
        treeInstance.mtxLocal.translation = startPos;
        obstacles.addChild(treeInstance);
        let StoneBlueprint = FudgeCore.Project.resources["Graph|2022-01-11T13:55:46.329Z|17331"];
        startPos = new ƒ.Vector3(3, 0, metercount + 6);
        let stoneInstance = await ƒ.Project.createGraphInstance(StoneBlueprint);
        stoneInstance.mtxLocal.translation = startPos;
        obstacles.addChild(stoneInstance);
        let treeStumpBlueprint = FudgeCore.Project.resources["Graph|2022-01-11T13:55:41.283Z|27993"];
        startPos = new ƒ.Vector3(-2, 0, metercount + 15);
        let treeStumpInstance = await ƒ.Project.createGraphInstance(treeStumpBlueprint);
        treeStumpInstance.mtxLocal.translation = startPos;
        obstacles.addChild(treeStumpInstance);
    }
    async function instaniateTree() {
        let treeBlueprint = FudgeCore.Project.resources["Graph|2022-01-11T13:55:44.114Z|12001"];
        let startPos = new ƒ.Vector3(Math.random() * 6 - 3, 0, metercount + startPoint);
        let treeInstance = await ƒ.Project.createGraphInstance(treeBlueprint);
        treeInstance.mtxLocal.translation = startPos;
        treeInstance.mtxLocal.rotateY(Math.random() * 360);
        obstacles.addChild(treeInstance);
    }
    async function instaniateStone() {
        let StoneBlueprint = FudgeCore.Project.resources["Graph|2022-01-11T13:55:46.329Z|17331"];
        let startPos = new ƒ.Vector3(Math.random() * 6 - 3, 0, metercount + startPoint);
        let stoneInstance = await ƒ.Project.createGraphInstance(StoneBlueprint);
        stoneInstance.mtxLocal.translation = startPos;
        stoneInstance.mtxLocal.rotateY(Math.random() * 360);
        obstacles.addChild(stoneInstance);
    }
    async function instaniateStump() {
        let treeStumpBlueprint = FudgeCore.Project.resources["Graph|2022-01-11T13:55:41.283Z|27993"];
        let startPos = new ƒ.Vector3(Math.random() * 4 - 2, 0, metercount + startPoint);
        let treeStumpInstance = await ƒ.Project.createGraphInstance(treeStumpBlueprint);
        treeStumpInstance.mtxLocal.translation = startPos;
        treeStumpInstance.mtxLocal.rotateY(Math.random() * 360);
        obstacles.addChild(treeStumpInstance);
    }
    async function instaniateCoin() {
        let CoinBlueprint = FudgeCore.Project.resources["Graph|2022-01-18T14:20:00.545Z|93108"];
        let startPos = new ƒ.Vector3(Math.random() * 4 - 3, 0, metercount + startPoint);
        let CoinInstance = await ƒ.Project.createGraphInstance(CoinBlueprint);
        CoinInstance.mtxLocal.translation = startPos;
        CoinInstance.mtxLocal.rotateY(Math.random() * 360);
        obstacles.addChild(CoinInstance);
    }
    function sin(x) {
        return Math.sin(7 * x);
    }
    function animation() {
        let rotation = map_range(sin(timeStamp), 1, 0, -50, 0);
        if (moving == MoveState.forward) {
            //console.log("timestamp", timeStamp);
            //console.log("sin", sin(timeStamp));
            //console.log("rotation: ", rotation);
            lLeg.mtxLocal.rotation = new ƒ.Vector3(rotation, 0, 0);
            rLeg.mtxLocal.rotation = new ƒ.Vector3(-rotation, 0, 0);
            lArm.mtxLocal.rotation = new ƒ.Vector3(-rotation, 0, 0);
            rArm.mtxLocal.rotation = new ƒ.Vector3(rotation, 0, 0);
        }
    }
    function map_range(v, from_min, from_max, to_min, to_max) {
        return to_min + (v - from_min) * (to_max - to_min) / (from_max - from_min);
    }
    function getcmpAudio(name) {
        switch (name) {
            case "sndGoldcoin":
                return graph.getComponents(ƒ.ComponentAudio)[2];
                break;
            case "sndHit":
                return graph.getComponents(ƒ.ComponentAudio)[1];
                break;
            case "sndBgMusic":
                return graph.getComponents(ƒ.ComponentAudio)[0];
                break;
            default:
                break;
        }
        /* let cmpAudios: ƒ.ComponentAudio[] = graph.getComponents(ƒ.ComponentAudio);
        for (let index = 0; index < cmpAudios.length; index++) {
          if (cmpAudios[index].getAudio().name == name) {
            return graph.getComponents(ƒ.ComponentAudio)[index];
          }
        } */
        return graph.getComponents(ƒ.ComponentAudio)[1];
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map