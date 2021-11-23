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
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let viewportMinimap;
    let graph;
    let cart;
    let cartNode;
    let minimapNode;
    let mtxTerrain;
    let meshTerrain;
    let cmpCamera = new ƒ.ComponentCamera();
    let cmpCameraMinimap = new ƒ.ComponentCamera();
    let carSpeed = 3;
    let carTurn = 2.5;
    let ctrForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrTurn = new ƒ.Control("Turn", 100, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(50);
    window.addEventListener("load", start);
    async function start(_event) {
        await ƒ.Project.loadResourcesFromHTML();
        graph = ƒ.Project.resources["Graph|2021-11-18T14:34:07.958Z|41539"];
        cart = graph.getChildrenByName("CartNode")[0].getChildrenByName("Cart")[0];
        cartNode = graph.getChildrenByName("CartNode")[0];
        minimapNode = graph.getChildrenByName("minimap")[0];
        cartNode.mtxLocal.translation = new ƒ.Vector3(-14.699, 3.0000, -33.458);
        cartNode.mtxLocal.rotation = new ƒ.Vector3(0, -90, 0);
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, -12);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);
        cartNode.addComponent(cmpCamera);
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
        //cmpCamera.mtxPivot.translation = new ƒ.Vector3(cart.mtxWorld.translation.x, cmpCamera.mtxPivot.translation.y, cart.mtxWorld.translation.z );
        //cmpCamera.mtxPivot.rotation = new ƒ.Vector3(cmpCamera.mtxPivot.rotation.x, cart.mtxWorld.rotation.y, cmpCamera.mtxPivot.rotation.z );
        //cmpCameraMinimap.mtxPivot.translation =  cmpCamera.mtxPivot.translation;
        //cmpCameraMinimap.mtxPivot.rotation = cmpCamera.mtxPivot.rotation;
        //cmpCameraMinimap.mtxPivot.translation = new ƒ.Vector3(cart.mtxWorld.translation.x, cmpCameraMinimap.mtxPivot.translation.y, cart.mtxWorld.translation.z );
        //cmpCameraMinimap.mtxPivot.rotation = new ƒ.Vector3(cmpCameraMinimap.mtxPivot.rotation.x, cart.mtxWorld.rotation.y, cmpCameraMinimap.mtxPivot.rotation.z );
        //wacmpCamera.mtxPivot.translateZ(-80);
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrTurn.setInput(turn * carTurn * deltaTime);
        cartNode.mtxLocal.rotateY(ctrTurn.getOutput());
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward * carSpeed * deltaTime);
        cartNode.mtxLocal.translateZ(ctrForward.getOutput());
        let terrainInfo = meshTerrain.getTerrainInfo(cartNode.mtxLocal.translation, mtxTerrain);
        cartNode.mtxLocal.translation = terrainInfo.position;
        cartNode.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cartNode.mtxLocal.getZ()), terrainInfo.normal);
        viewportMinimap.draw();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map