"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let CartCustomComponentScript = /** @class */ (() => {
        class CartCustomComponentScript extends ƒ.ComponentScript {
            constructor() {
                super();
                // Properties may be mutated by users in the editor via the automatically created user interface
                this.message = "CustomComponentScript added to ";
                this.lapProgress = 0;
                this.lapTime = 0;
                // Activate the functions of this component as response to events
                this.hndEvent = (_event) => {
                    switch (_event.type) {
                        case "componentAdd" /* COMPONENT_ADD */:
                            ƒ.Debug.log(this.message, this.node.name);
                            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                            //ƒ.Debug.log(this.message, this.getContainer());
                            break;
                        case "componentRemove" /* COMPONENT_REMOVE */:
                            this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                            this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                            break;
                    }
                };
                this.update = (_event) => {
                    //if (GameState.get().gameRunning){
                    // this.cartControlls(_event)
                    //}
                    /* let collider: ƒ.ComponentRigidbody = this.node.getComponent(ƒ.ComponentRigidbody)
                    collider.checkCollisionEvents(); */
                };
                this.reset = () => {
                    this.node.mtxLocal.translation = new ƒ.Vector3(-16, 3.0000, -34.5);
                    this.node.mtxLocal.rotation = new ƒ.Vector3(0, -90, 0);
                    this.ctrForward.setDelay(0);
                    this.ctrForward.setInput(0);
                    this.ctrTurn.setInput(0);
                    this.ctrForward.setDelay(1000);
                    this.ctrTurn.setInput(80);
                    this.cpArray.fill(false);
                };
                this.resetLight = (cpNumber) => {
                    console.log("Reset to CP" + cpNumber);
                    switch (cpNumber) {
                        case 1:
                            this.node.mtxLocal.translation = new ƒ.Vector3(-41.3, 0, 1);
                            this.node.mtxLocal.rotation = new ƒ.Vector3(0, 0, 0);
                            break;
                        case 2:
                            this.node.mtxLocal.translation = new ƒ.Vector3(-37, 0, 33);
                            this.node.mtxLocal.rotation = new ƒ.Vector3(0, 45, 0);
                            break;
                        case 3:
                            this.node.mtxLocal.translation = new ƒ.Vector3(8.4, 0, 36.2);
                            this.node.mtxLocal.rotation = new ƒ.Vector3(0, 135, 0);
                            break;
                        case 4:
                            this.node.mtxLocal.translation = new ƒ.Vector3(-17.3, 0, 5);
                            this.node.mtxLocal.rotation = new ƒ.Vector3(0, -180, 0);
                            break;
                        case 5:
                            this.node.mtxLocal.translation = new ƒ.Vector3(29.7, 0, 12);
                            this.node.mtxLocal.rotation = new ƒ.Vector3(0, 90, 0);
                            break;
                        case 6:
                            this.node.mtxLocal.translation = new ƒ.Vector3(35, 3, -31);
                            this.node.mtxLocal.rotation = new ƒ.Vector3(0, 225, 0);
                            break;
                        case 7:
                            this.node.mtxLocal.translation = new ƒ.Vector3(-16, 3.0000, -34.5);
                            this.node.mtxLocal.rotation = new ƒ.Vector3(0, -90, 0);
                            break;
                        default:
                            break;
                    }
                    this.ctrForward.setDelay(0);
                    this.ctrForward.setInput(0);
                    this.ctrTurn.setInput(0);
                    this.ctrForward.setDelay(1000);
                    this.ctrTurn.setInput(80);
                };
                this.cartControlls = (_event) => {
                    let deltaTime = ƒ.Loop.timeFrameReal / 1000;
                    let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
                    this.ctrTurn.setInput(turn * deltaTime);
                    /* if (this.ctrForward.getOutput() < 0) {
                      this.node.mtxLocal.rotateY(-this.ctrTurn.getOutput());
                    } else {
                      this.node.mtxLocal.rotateY(this.ctrTurn.getOutput());
                    } */
                    let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
                    this.ctrForward.setInput(forward * deltaTime);
                    //this.node.mtxLocal.translateZ(this.ctrForward.getOutput());
                    let speed = this.ctrForward.getOutput().valueOf();
                    let speedTacho = this.map_range(speed, 0, 2.5, 0, 270);
                    if (speed > 0) {
                        document.getElementById("needle").style.transform = "rotate(" + (-speedTacho + 45) + "deg)";
                        Script.GameState.get().speed = speed.toFixed(2) + " m/s";
                    }
                    else {
                        document.getElementById("needle").style.transform = "rotate(" + (speedTacho + 45) + "deg)";
                        Script.GameState.get().speed = -speed.toFixed(2) + " m/s";
                    }
                };
                this.ctrForward = new ƒ.Control("Forward", 50, 0 /* PROPORTIONAL */);
                this.ctrForward.setDelay(1000);
                this.ctrTurn = new ƒ.Control("Turn", 100, 0 /* PROPORTIONAL */);
                this.ctrTurn.setDelay(80);
                // Don't start when running in editor
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                // Listen to this component being added to or removed from a node
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            }
            map_range(v, from_min, from_max, to_min, to_max) {
                return to_min + (v - from_min) * (to_max - to_min) / (from_max - from_min);
            }
        }
        // Register the script as component for use in the editor via drag&drop
        CartCustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CartCustomComponentScript);
        return CartCustomComponentScript;
    })();
    Script.CartCustomComponentScript = CartCustomComponentScript;
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
                            //ƒ.Debug.log(this.message, this.getContainer());
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
            this.name = "MarkusCart";
            this.lapprogress = 0;
            this.laptime = 0;
            this.laptimeString = "";
            this.laps = 0;
            this.gameRunning = false;
            this.speed = "0 m/s";
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
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let viewportMinimap;
    let graph;
    let cart;
    let cartNode;
    let cartRb;
    let cartBody;
    let minimapNode;
    let checkpoints;
    let mtxTerrain;
    let meshTerrain;
    let cartMaxSpeed = 80;
    //let runningLap: boolean = false;
    let cameraNode = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    let cmpCameraMinimap = new ƒ.ComponentCamera();
    /* let carSpeed: number = 3;
    let carTurn: number = 2.5; */
    let ctrForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(1000);
    let ctrTurn = new ƒ.Control("Turn", 10, 0 /* PROPORTIONAL */);
    ctrTurn.setDelay(80);
    window.addEventListener("load", start);
    async function start(_event) {
        await ƒ.Project.loadResourcesFromHTML();
        graph = ƒ.Project.resources["Graph|2021-11-18T14:34:07.958Z|41539"];
        cart = graph.getChildrenByName("CartNode")[0].getChildrenByName("Cart")[0];
        cart.mtxLocal.translateY(0.5);
        cartBody = cart.getChildrenByName("Body")[0];
        cartNode = graph.getChildrenByName("CartNode")[0];
        minimapNode = graph.getChildrenByName("minimap")[0];
        checkpoints = graph.getChildrenByName("Terrain")[0].getChildrenByName("Checkpoints")[0];
        cartRb = cartNode.getComponent(ƒ.ComponentRigidbody);
        cartNode.getComponent(Script.CartCustomComponentScript).cpArray = new Array(checkpoints.nChildren).fill(false);
        console.log("array ", cartNode.getComponent(Script.CartCustomComponentScript).cpArray);
        cartNode.mtxLocal.translation = new ƒ.Vector3(-16, 3.0000, -34.5);
        cartNode.mtxLocal.rotation = new ƒ.Vector3(0, -90, 0);
        //checkpoints.getChildren().forEach(element => {
        cartNode.getComponent(ƒ.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, hndCollision);
        //});
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, -12);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform());
        graph.addChild(cameraNode);
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        cmpCameraMinimap.mtxPivot.translation = new ƒ.Vector3(0, 120, 0);
        cmpCameraMinimap.mtxPivot.rotation = new ƒ.Vector3(90, 180, 0);
        minimapNode.addComponent(cmpCameraMinimap);
        let canvasMinimap = document.querySelector("#minimap");
        viewportMinimap = new ƒ.Viewport();
        viewportMinimap.initialize("Viewport", graph, cmpCameraMinimap, canvasMinimap);
        viewportMinimap.calculateTransforms();
        viewport.calculateTransforms();
        ƒ.Physics.adjustTransforms(graph);
        ƒ.AudioManager.default.listenTo(graph);
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        let cmpMeshTerrain = graph.getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
        meshTerrain = cmpMeshTerrain.mesh;
        mtxTerrain = cmpMeshTerrain.mtxWorld;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        console.log("graph: ", graph);
    }
    function update(_event) {
        cartStbilizer();
        placeCameraOnCart();
        hudConstrolls();
        ƒ.Physics.world.simulate(Math.min(0.1, ƒ.Loop.timeFrameReal / 1000));
        if (Script.GameState.get().gameRunning) {
            cartControlls();
            document.querySelector("#info").setAttribute("hidden", "true");
        }
        else if (!Script.GameState.get().gameRunning) {
            startGame();
            document.querySelector("#info").removeAttribute("hidden");
        }
        if (Script.GameState.get().lapRunning) {
            Script.GameState.get().laptime += 1;
        }
        viewportMinimap.draw();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function map_range(v, from_min, from_max, to_min, to_max) {
        return to_min + (v - from_min) * (to_max - to_min) / (from_max - from_min);
    }
    /* function passedTime(startTime: ƒ.Time): number {
      let passedTime = ƒ.Time - startTime;
    } */
    function hudConstrolls() {
        //ƒ.Time.
        Script.GameState.get().laptimeString = toHHMMSSMSMS(Script.GameState.get().laptime);
        if (!Script.GameState.get().lapRunning) {
            Script.GameState.get().laptimeString = "-- : -- : -- : --";
        }
        let counter = 0;
        for (let i = 0; i < cartNode.getComponent(Script.CartCustomComponentScript).cpArray.length; i++) {
            if (cartNode.getComponent(Script.CartCustomComponentScript).cpArray[i]) {
                counter++;
            }
        }
        if (counter == 7) {
            Script.GameState.get().laps++;
            cartNode.getComponent(Script.CartCustomComponentScript).cpArray.fill(false);
            console.log("Laptime: ", Script.GameState.get().laptimeString);
            Script.GameState.get().laptime = 0;
        }
        Script.GameState.get().lapprogress = counter / 7;
    }
    function cartStbilizer() {
        let maxHeight = 0.3;
        let minHeight = 0.2;
        let wheelNodes = cartBody.getChildren();
        let force = ƒ.Vector3.SCALE(ƒ.Physics.world.getGravity(), -cartRb.mass / wheelNodes.length);
        for (let wheelNode of wheelNodes) {
            let posWheel = wheelNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
            let terrainInfo = meshTerrain.getTerrainInfo(posWheel, mtxTerrain);
            let height = posWheel.y - terrainInfo.position.y;
            let forceScale = 1;
            if (height > maxHeight) {
                forceScale = 0;
            }
            else if (height <= maxHeight && height >= minHeight) {
                forceScale = 1 / (height * 2);
            }
            else {
                forceScale = 1 / (height);
            }
            cartRb.applyForceAtPoint(ƒ.Vector3.SCALE(force, 1 / (height * 2)), posWheel);
        }
    }
    function cartStbilizerV2() {
        let maxHeight = 0.3;
        let minHeight = 0.2;
        let wheelNodes = cartBody.getChildren();
        let force = ƒ.Vector3.SCALE(ƒ.Physics.world.getGravity(), -cartRb.mass / wheelNodes.length);
        for (let wheelNode of wheelNodes) {
            let posWheel = wheelNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
            let terrainInfo = meshTerrain.getTerrainInfo(posWheel, mtxTerrain);
            let height = posWheel.y - terrainInfo.position.y;
            let forceScale = map_range(1 / height, minHeight, maxHeight, 0, 4);
            console.log(forceScale);
            cartRb.applyForceAtPoint(ƒ.Vector3.SCALE(force, forceScale), posWheel);
        }
    }
    function cartControlls() {
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward);
        cartRb.applyForce(ƒ.Vector3.SCALE(cartNode.mtxLocal.getZ(), ctrForward.getOutput() * cartRb.mass * 80));
        let speed = ctrForward.getOutput() * cartRb.mass * 30 / 1000;
        let speedTacho = map_range(speed, 0, cartMaxSpeed, 0, 270);
        if (speed > 0) {
            document.getElementById("needle").style.transform = "rotate(" + (-speedTacho + 45) + "deg)";
            Script.GameState.get().speed = speed.toFixed(2) + " km/h";
        }
        else {
            document.getElementById("needle").style.transform = "rotate(" + (speedTacho + 45) + "deg)";
            Script.GameState.get().speed = -speed.toFixed(2) + " km/h";
        }
        let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrTurn.setInput(turn);
        if (ctrForward.getOutput() < 0) {
            cartRb.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), -ctrTurn.getOutput() * 6));
        }
        else {
            cartRb.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput() * 6));
        }
    }
    function startGame() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ENTER])) {
            Script.GameState.get().gameRunning = true;
        }
    }
    function toHHMMSSMSMS(time) {
        let ms_num = time;
        let hours = Math.floor(ms_num / 360000);
        let minutes = Math.floor((ms_num - (hours * 360000)) / 6000);
        let seconds = Math.floor((ms_num - (hours * 360000) - (minutes * 6000)) / 100);
        let milliSeconds = ms_num - (hours * 360000) - (minutes * 6000) - (seconds * 100);
        let hoursSt = hours.toString();
        let minutesSt = minutes.toString();
        let secondsSt = seconds.toString();
        let milliSecondsSt = milliSeconds.toString();
        if (hours < 10) {
            hoursSt = "0" + hours;
        }
        if (minutes < 10) {
            minutesSt = "0" + minutes;
        }
        if (seconds < 10) {
            secondsSt = "0" + seconds;
        }
        if (milliSeconds < 10) {
            milliSecondsSt = "0" + milliSeconds;
        }
        return hoursSt + ':' + minutesSt + ':' + secondsSt + ':' + milliSecondsSt;
    }
    function hndCollision(_event) {
        let cp = _event.cmpRigidbody.node;
        console.log("passed by", cp.name);
        let index = 0;
        switch (cp.name) {
            case "CP1":
                index = 0;
                break;
            case "CP2":
                index = 1;
                break;
            case "CP3":
                index = 2;
                break;
            case "CP4":
                index = 3;
                break;
            case "CP5":
                index = 4;
                break;
            case "CP6":
                index = 5;
                break;
            case "startCP":
                index = 6;
                break;
            default:
                break;
        }
        let counter = 0;
        cartNode.getComponent(Script.CartCustomComponentScript).cpArray.forEach(element => {
            if (element)
                counter++;
        });
        if (index == 6 && counter == 0) {
            console.log();
            Script.GameState.get().lapRunning = true;
            Script.GameState.get().laptime = 0;
            console.log("Lap started");
            cartNode.getComponent(Script.CartCustomComponentScript).cpArray[index] = true;
        }
        else {
            if (cartNode.getComponent(Script.CartCustomComponentScript).cpArray[index - 1] && index > 0) {
                cartNode.getComponent(Script.CartCustomComponentScript).cpArray[index] = true;
            }
            else if (index == 0 && cartNode.getComponent(Script.CartCustomComponentScript).cpArray[cartNode.getComponent(Script.CartCustomComponentScript).cpArray.length - 1]) {
                cartNode.getComponent(Script.CartCustomComponentScript).cpArray[index] = true;
                cartNode.getComponent(Script.CartCustomComponentScript).cpArray[cartNode.getComponent(Script.CartCustomComponentScript).cpArray.length - 1] = false;
            }
            else {
                console.log("Skipped: " + ", Index; " + (index - 1));
                cartNode.getComponent(Script.CartCustomComponentScript).resetLight(index); // currently doesnt work because of physics
            }
        }
        console.log(cartNode.getComponent(Script.CartCustomComponentScript).cpArray.toString());
    }
    function placeCameraOnCart() {
        cameraNode.mtxLocal.mutate({
            translation: cart.mtxWorld.translation,
            rotation: new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0),
        });
    }
    /* function placeCartOnTerrain(): void {
      let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(cartNode.mtxLocal.translation, mtxTerrain);
      cartNode.mtxLocal.translation = terrainInfo.position;
      cartNode.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cartNode.mtxLocal.getZ()), terrainInfo.normal);
    } */
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map