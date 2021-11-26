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
                    this.cartControlls(_event);
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
                    if (this.ctrForward.getOutput() < 0) {
                        this.node.mtxLocal.rotateY(-this.ctrTurn.getOutput());
                    }
                    else {
                        this.node.mtxLocal.rotateY(this.ctrTurn.getOutput());
                    }
                    let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
                    this.ctrForward.setInput(forward * deltaTime);
                    this.node.mtxLocal.translateZ(this.ctrForward.getOutput());
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
    let minimapNode;
    let checkpoints;
    let mtxTerrain;
    let meshTerrain;
    //let runningLap: boolean = false;
    let cameraNode = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    let cmpCameraMinimap = new ƒ.ComponentCamera();
    /* let carSpeed: number = 3;
    let carTurn: number = 2.5; */
    let ctrForward = new ƒ.Control("Forward", 50, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(1000);
    let ctrTurn = new ƒ.Control("Turn", 100, 0 /* PROPORTIONAL */);
    ctrTurn.setDelay(80);
    window.addEventListener("load", start);
    async function start(_event) {
        await ƒ.Project.loadResourcesFromHTML();
        graph = ƒ.Project.resources["Graph|2021-11-18T14:34:07.958Z|41539"];
        cart = graph.getChildrenByName("CartNode")[0].getChildrenByName("Cart")[0];
        cart.mtxLocal.translateY(0.5);
        cartNode = graph.getChildrenByName("CartNode")[0];
        minimapNode = graph.getChildrenByName("minimap")[0];
        checkpoints = graph.getChildrenByName("Terrain")[0].getChildrenByName("Checkpoints")[0];
        cartNode.getComponent(Script.CartCustomComponentScript).cpArray = new Array(checkpoints.nChildren).fill(true);
        console.log("array ", cartNode.getComponent(Script.CartCustomComponentScript).cpArray);
        cartNode.mtxLocal.translation = new ƒ.Vector3(-16, 3.0000, -34.5);
        cartNode.mtxLocal.rotation = new ƒ.Vector3(0, -90, 0);
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
        // ƒ.Physics.world.simulate();  // if physics is included and used
        //console.log("trans", cartNode.mtxLocal.translation.toString());
        //console.log("rot ", cmpCamera.mtxPivot.rotation.toString());
        //cameraNode.mtxLocal.translation = cart.mtxWorld.translation;
        //cameraNode.mtxLocal.rotation = new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0);
        placeCameraOnCart();
        placeCartOnTerrain();
        for (let index = 0; index < checkpoints.nChildren; index++) {
            checkCollision(cartNode, checkpoints.getChildren()[index]);
            //console.log("name ", checkpoints.getChildren()[index]);
        }
        Script.GameState.get().laptime += 1;
        //ƒ.Time.
        Script.GameState.get().laptimeString = toHHMMSSMSMS(Script.GameState.get().laptime);
        if (!Script.GameState.get().gameRunning) {
            Script.GameState.get().laptimeString = "-- : -- : -- : --";
        }
        let counter = 0;
        for (let i = 0; i < cartNode.getComponent(Script.CartCustomComponentScript).cpArray.length; i++) {
            if (cartNode.getComponent(Script.CartCustomComponentScript).cpArray[i]) {
                counter++;
            }
        }
        if (counter == cartNode.getComponent(Script.CartCustomComponentScript).cpArray.length) {
            Script.GameState.get().laps++;
            cartNode.getComponent(Script.CartCustomComponentScript).cpArray.fill(false);
            console.log("Laptime: ", Script.GameState.get().laptimeString);
            Script.GameState.get().laptime = 0;
        }
        Script.GameState.get().lapprogress = counter / 7;
        viewportMinimap.draw();
        viewport.draw();
        ƒ.AudioManager.default.update();
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
    /* function checkCollision() {
       for (let index = 0; index < checkpoints.nChildren; index++) {
         let cp: ƒ.Node = checkpoints.getChildren()[index];
         let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(cartNode.mtxWorld.translation, cp.mtxWorldInverse, true);
         let x = cp.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + cartNode.radius;
         let y = cp.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y / 2 + cartNode.radius;
   
         if (posLocal.x <= (x) && posLocal.x >= -(x) && posLocal.y <= y && posLocal.y >= 0) {
           console.log("intersecting", cp.name);
           GameState.get().lapprogress -= 0.1;
           if (GameState.get().laptime >= 500) {
             GameState.get().laptime -= 500;
           } else {
             GameState.get().laptime = 0;
           }
   
           /*  let cmpAudio: ƒ.ComponentAudio = getcmpAudio("sndHit");
           cmpAudio.play(true);
   
           cartNode.getComponent(agentComponentScript).respawn();
         }
         
       }
        checkpoints.getChildren().forEach(element => {
         let cp: ƒ.Node = element;
         let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(cartNode.mtxWorld.translation, cp.mtxWorldInverse, true);
         let x = cp.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + cartNode.radius;
         let y = cp.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y / 2 + cartNode.radius;
   
         if (posLocal.x <= (x) && posLocal.x >= -(x) && posLocal.y <= y && posLocal.y >= 0) {
           console.log("intersecting");
           GameState.get().lapprogress -= 0.1;
           if (GameState.get().laptime >= 500) {
             GameState.get().laptime -= 500;
           } else {
             GameState.get().laptime = 0;
           }
   
             let cmpAudio: ƒ.ComponentAudio = getcmpAudio("sndHit");
           cmpAudio.play(true);
   
           cartNode.getComponent(agentComponentScript).respawn();
         }
       });
   
     }
   */
    function checkCollision(collider, obstacle) {
        let distance = ƒ.Vector3.TRANSFORMATION(collider.mtxWorld.translation, obstacle.mtxWorldInverse, true);
        let minX = obstacle.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + collider.radius;
        let minY = obstacle.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + collider.radius;
        if (distance.x <= (minX) && distance.x >= -(minX) && distance.y <= minY && distance.y >= 0) {
            console.log("passed by", obstacle.name);
            let index = 0;
            switch (obstacle.name) {
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
                    if (!cartNode.getComponent(Script.CartCustomComponentScript).cpArray[0]) {
                        Script.GameState.get().gameRunning = true;
                        Script.GameState.get().laptime = 0;
                    }
                    break;
                default:
                    break;
            }
            if (cartNode.getComponent(Script.CartCustomComponentScript).cpArray[index - 1]) {
                cartNode.getComponent(Script.CartCustomComponentScript).cpArray[0] = true;
            }
            else {
                console.log("Skipped CP: " + (index));
                cartNode.getComponent(Script.CartCustomComponentScript).resetLight(index);
            }
        }
    }
    function placeCameraOnCart() {
        cameraNode.mtxLocal.mutate({
            translation: cart.mtxWorld.translation,
            rotation: new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0),
        });
    }
    function placeCartOnTerrain() {
        let terrainInfo = meshTerrain.getTerrainInfo(cartNode.mtxLocal.translation, mtxTerrain);
        cartNode.mtxLocal.translation = terrainInfo.position;
        cartNode.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cartNode.mtxLocal.getZ()), terrainInfo.normal);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map