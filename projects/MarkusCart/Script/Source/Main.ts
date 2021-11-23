namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  let cart: ƒ.Node;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 100, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(50);


  document.addEventListener("interactiveViewportStarted", <any>start);

  let map: ƒ.Node = new ƒ.Node("RaceTrack");

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    viewport.calculateTransforms();

    let graph: ƒ.Node = viewport.getBranch();
    cart = viewport.getBranch().getChildrenByName("Cart")[0];

    //let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);

    let heightMap = new ƒ.TextureImage();
    await heightMap.load("../Texture/map.png");

    let mtrTexFlat: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2021-11-23T13:24:15.410Z|41994"];
    let material = new ƒ.ComponentMaterial(mtrTexFlat);
    let gridMeshFlat: ƒ.MeshTerrain = new ƒ.MeshRelief("HeightMap", heightMap);
    let grid = new ƒ.ComponentMesh(gridMeshFlat);
    let transform = new ƒ.ComponentTransform();

    grid.mtxPivot.scale(new ƒ.Vector3(100, 10, 100));
    

    map.addComponent(grid);
    map.addComponent(material);
    map.addComponent(transform);

    graph.addChild(map);


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
     ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn * deltaTime);
    cart.mtxLocal.rotateY(ctrTurn.getOutput());

    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward * deltaTime);
    cart.mtxLocal.translateZ(ctrForward.getOutput());


    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}