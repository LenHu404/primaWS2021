namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  let viewportMinimap: ƒ.Viewport;
  let graph: ƒ.Graph;
  let cart: ƒ.Node;
  let cartNode: ƒ.Node;
  let minimapNode: ƒ.Node;
  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;

  let camera: ƒ.Node = new ƒ.Node("cameraNode");
  let cmpCamera = new ƒ.ComponentCamera();

  let cmpCameraMinimap = new ƒ.ComponentCamera();

  /* let carSpeed: number = 3;
  let carTurn: number = 2.5; */

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 50, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(1000);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 100, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrTurn.setDelay(80);


  window.addEventListener("load", start);

  async function start(_event: Event): Promise<void> {

    await ƒ.Project.loadResourcesFromHTML();
    graph = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-18T14:34:07.958Z|41539"];


    cart = graph.getChildrenByName("CartNode")[0].getChildrenByName("Cart")[0];
    cart.mtxLocal.translateY(0.5);
    cartNode = graph.getChildrenByName("CartNode")[0];
    minimapNode = graph.getChildrenByName("minimap")[0];

    cartNode.mtxLocal.translation = new ƒ.Vector3(-16, 3.0000, -34.5);
    cartNode.mtxLocal.rotation = new ƒ.Vector3(0, -90, 0);



    cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, -12);
    cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);

    camera.addComponent(cmpCamera);
    camera.addComponent(new ƒ.ComponentTransform());
    graph.addChild(camera);

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);



    cmpCameraMinimap.mtxPivot.translation = new ƒ.Vector3(0, 120, 0);
    cmpCameraMinimap.mtxPivot.rotation = new ƒ.Vector3(90, 180, 0);
    minimapNode.addComponent(cmpCameraMinimap);

    let canvasMinimap: HTMLCanvasElement = document.querySelector("#minimap");
    viewportMinimap = new ƒ.Viewport();
    viewportMinimap.initialize("Viewport", graph, cmpCameraMinimap, canvasMinimap);



    viewportMinimap.calculateTransforms();
    viewport.calculateTransforms();


    ƒ.AudioManager.default.listenTo(graph);
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));


    let cmpMeshTerrain: ƒ.ComponentMesh = graph.getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
    meshTerrain = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
    mtxTerrain = cmpMeshTerrain.mtxWorld;



    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log("graph: ", graph);

  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used
    //console.log("trans", cartNode.mtxLocal.translation.toString());
    //console.log("rot ", cmpCamera.mtxPivot.rotation.toString());

    camera.mtxLocal.translation = cart.mtxWorld.translation;
    camera.mtxLocal.rotation = new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0);

    //cmpCameraMinimap.mtxPivot.translation =  cmpCamera.mtxPivot.translation;
    //cmpCameraMinimap.mtxPivot.rotation = cmpCamera.mtxPivot.rotation;

    //cmpCameraMinimap.mtxPivot.translation = new ƒ.Vector3(cart.mtxWorld.translation.x, cmpCameraMinimap.mtxPivot.translation.y, cart.mtxWorld.translation.z );
    //cmpCameraMinimap.mtxPivot.rotation = new ƒ.Vector3(cmpCameraMinimap.mtxPivot.rotation.x, cart.mtxWorld.rotation.y, cmpCameraMinimap.mtxPivot.rotation.z );
    //wacmpCamera.mtxPivot.translateZ(-80);


    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn * deltaTime);
    cartNode.mtxLocal.rotateY(ctrTurn.getOutput());

    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward * deltaTime);
    cartNode.mtxLocal.translateZ(ctrForward.getOutput());

    let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(cartNode.mtxLocal.translation, mtxTerrain);
    cartNode.mtxLocal.translation = terrainInfo.position;
    cartNode.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cartNode.mtxLocal.getZ()), terrainInfo.normal);

    cmpCamera.mtxWorldToView.rotation = new ƒ.Vector3(25, cmpCameraMinimap.mtxWorldToView.rotation.y, 0);

    viewportMinimap.draw();
    viewport.draw();

    ƒ.AudioManager.default.update();
  }
}