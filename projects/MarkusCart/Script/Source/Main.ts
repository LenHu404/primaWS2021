namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  let viewportMinimap: ƒ.Viewport;
  let graph: ƒ.Graph;
  let cart: ƒ.Node;
  let cartNode: ƒ.Node;
  let cartRb: ƒ.ComponentRigidbody;
  let cartBody: ƒ.Node;
  let minimapNode: ƒ.Node;
  let checkpoints: ƒ.Node;
  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;
  let mtxFriction: ƒ.Matrix4x4;
  let meshFriction: ƒ.MeshTerrain;
  let isGrounded: boolean = false;
  let dampTranslation: number;
  let dampRotation: number;

  let cartMaxSpeed: number = 80;
  //let runningLap: boolean = false;

  let cameraNode: ƒ.Node = new ƒ.Node("cameraNode");
  let cmpCamera = new ƒ.ComponentCamera();

  let cmpCameraMinimap = new ƒ.ComponentCamera();

  /* let carSpeed: number = 3;
  let carTurn: number = 2.5; */

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 32000, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(5000);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 1000, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrTurn.setDelay(100);


  window.addEventListener("load", start);

  async function start(_event: Event): Promise<void> {

    await ƒ.Project.loadResourcesFromHTML();
    graph = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-18T14:34:07.958Z|41539"];


    cart = graph.getChildrenByName("CartNode")[0].getChildrenByName("Cart")[0];
    cart.mtxLocal.translateY(0.5);
    cartBody = cart.getChildrenByName("Body")[0];
    cartNode = graph.getChildrenByName("CartNode")[0];
    minimapNode = graph.getChildrenByName("minimap")[0];
    checkpoints = graph.getChildrenByName("Terrain")[0].getChildrenByName("Checkpoints")[0];
    cartRb = cartNode.getComponent(ƒ.ComponentRigidbody);

    cartNode.getComponent(CartCustomComponentScript).cpArray = new Array<boolean>(checkpoints.nChildren).fill(false);
    console.log("array ", cartNode.getComponent(CartCustomComponentScript).cpArray);
    cartNode.mtxLocal.translation = new ƒ.Vector3(-16, 3.0000, -34.5);
    cartNode.mtxLocal.rotation = new ƒ.Vector3(0, -90, 0);

    //checkpoints.getChildren().forEach(element => {
    cartNode.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, hndCollision)
    //});

    dampTranslation = cartRb.dampTranslation;
    dampRotation = cartRb.dampRotation;

    cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, -12);
    cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);

    cameraNode.addComponent(cmpCamera);
    cameraNode.addComponent(new ƒ.ComponentTransform());
    graph.addChild(cameraNode);

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

    ƒ.Physics.adjustTransforms(graph);
    ƒ.AudioManager.default.listenTo(graph);
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));


    let cmpMeshTerrain: ƒ.ComponentMesh = graph.getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
    meshTerrain = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
    mtxTerrain = cmpMeshTerrain.mtxWorld;

    let cmpMeshFriction: ƒ.ComponentMesh = graph.getChildrenByName("Terrain")[0].getChildrenByName("FrictionMap")[0].getComponent(ƒ.ComponentMesh);
    meshFriction = <ƒ.MeshTerrain>cmpMeshFriction.mesh;
    mtxFriction = cmpMeshFriction.mtxWorld;


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log("graph: ", graph);

  }

  function update(_event: Event): void {

    cartControlls();
    placeCameraOnCart();
    hudConstrolls();


    ƒ.Physics.world.simulate(Math.min(0.1, ƒ.Loop.timeFrameReal / 1000));

    if (GameState.get().gameRunning) {
      document.querySelector("#info").setAttribute("hidden", "true");
    } else if (!GameState.get().gameRunning) {
      startGame();
      document.querySelector("#info").removeAttribute("hidden");
    }
    if (GameState.get().lapRunning) {
      GameState.get().laptime += 1;
    }



    viewportMinimap.draw();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function map_range(v: number, from_min: number, from_max: number, to_min: number, to_max: number): number {
    return to_min + (v - from_min) * (to_max - to_min) / (from_max - from_min);
  }

  /* function passedTime(startTime: ƒ.Time): number {
    let passedTime = ƒ.Time - startTime; 
  } */

  function hudConstrolls(): void {
    //ƒ.Time.
    GameState.get().laptimeString = toHHMMSSMSMS(GameState.get().laptime);
    if (!GameState.get().lapRunning) {
      GameState.get().laptimeString = "-- : -- : -- : --";
    }
    let counter: number = 0;
    for (let i = 0; i < cartNode.getComponent(CartCustomComponentScript).cpArray.length; i++) {
      if (cartNode.getComponent(CartCustomComponentScript).cpArray[i]) {
        counter++;
      }
    }
    if (counter == 7) {
      GameState.get().laps++;
      cartNode.getComponent(CartCustomComponentScript).cpArray.fill(false);
      console.log("Laptime: ", GameState.get().laptimeString);
      GameState.get().laptime = 0;
    }

    GameState.get().lapprogress = counter / 7;
  }

  /*  function cartStbilizer():void {
     /* let maxHeight: number = 0.3;
     let minHeight: number = 0.2; /
     let wheelNodes: ƒ.Node[] = cartBody.getChildren();
     let force: ƒ.Vector3 = ƒ.Vector3.SCALE(ƒ.Physics.world.getGravity(), -cartRb.mass / wheelNodes.length);
 
     for (let wheelNode of wheelNodes) {
       let posWheel: ƒ.Vector3 = wheelNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
       let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(posWheel, mtxTerrain);
       let height: number = posWheel.y - terrainInfo.position.y;
 
       cartRb.applyForceAtPoint(ƒ.Vector3.SCALE(force, 1 /height), posWheel);
     }
   } */

  function cartControlls(): void {
    let maxHeight: number = 0.3;
    let minHeight: number = 0.2;
    let wheelNodes: ƒ.Node[] = cartBody.getChildren();
    let force: ƒ.Vector3 = ƒ.Vector3.SCALE(ƒ.Physics.world.getGravity(), -cartRb.mass / wheelNodes.length);

    isGrounded = false;
    for (let forceNode of wheelNodes) {
      let posWheel: ƒ.Vector3 = forceNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
      let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(posWheel, mtxTerrain);
      let height: number = posWheel.y - terrainInfo.position.y;

      if (height < maxHeight) {
        cartRb.applyForceAtPoint(ƒ.Vector3.SCALE(force, (maxHeight - height) / (maxHeight - minHeight)), posWheel);
        isGrounded = true;
      }
    }

    if (GameState.get().gameRunning) {
      if (isGrounded) {
        cartRb.dampTranslation = dampTranslation;
        cartRb.dampRotation = dampRotation;
        let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrTurn.setInput(turn);
       // if (ctrForward.getOutput() < 0) {
       //   cartRb.applyTorque(ƒ.Vector3.SCALE(cart.mtxLocal.getY(), -ctrTurn.getOutput()));
       // } else {
          cartRb.applyTorque(ƒ.Vector3.SCALE(cart.mtxLocal.getY(), ctrTurn.getOutput()));

       // }
        let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);

        let posCart: ƒ.Vector3 = cartNode.getChildren()[0].getChildren()[0].getComponent(ƒ.ComponentMesh).mtxWorld.translation;
        let frictionInfo: ƒ.TerrainInfo = meshFriction.getTerrainInfo(posCart, mtxFriction);

        let frictionScale: number = posCart.y - frictionInfo.position.y;
 /*
        let cmpTexFric: ƒ.ComponentMaterial = graph.getChildrenByName("Terrain")[0].getChildrenByName("FrictionMap")[0].getComponent(ƒ.ComponentMaterial);
        let colorInfo:  ƒ.TextureImage = <ƒ.TextureImage>ƒ.Project.resources["Graph|2021-11-18T14:34:07.958Z|41539"];
        let test: any = frictionInfo.position. */

        //cartRb.dampTranslation *= 1/frictionScale;

        ctrForward.setInput(forward); 
        cartRb.applyForce(ƒ.Vector3.SCALE(cartNode.mtxLocal.getZ(), ctrForward.getOutput()));
      }
      else
        cartRb.dampRotation = cartRb.dampTranslation = 0;
    }


    let speed: number = ctrForward.getOutput() * cartRb.mass / 100000;

    let speedTacho = map_range(speed, 0, cartMaxSpeed, 0, 270);

    if (speed > 0) {
      document.getElementById("needle").style.transform = "rotate(" + (-speedTacho + 45) + "deg)";
      GameState.get().speed = speed.toFixed(2) + " km/h";
    } else {
      document.getElementById("needle").style.transform = "rotate(" + (speedTacho + 45) + "deg)";
      GameState.get().speed = -speed.toFixed(2) + " km/h";
    }

  }

  /*  function cartControlls():void {
   
     let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
     ctrForward.setInput(forward);
     cartRb.applyForce(ƒ.Vector3.SCALE(cartNode.mtxLocal.getZ(), ctrForward.getOutput() * cartRb.mass * 80));
 
 
 
     let speed: number = ctrForward.getOutput() * cartRb.mass * 30 / 1000;
 
     let speedTacho = map_range(speed, 0, cartMaxSpeed, 0, 270);
 
     if (speed > 0) {
       document.getElementById("needle").style.transform = "rotate(" + (-speedTacho + 45) + "deg)";
       GameState.get().speed = speed.toFixed(2) + " km/h";
     } else {
       document.getElementById("needle").style.transform = "rotate(" + (speedTacho + 45) + "deg)";
       GameState.get().speed = -speed.toFixed(2) + " km/h";
     }
 
 
     let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
 
     ctrTurn.setInput(turn);
 
     if (ctrForward.getOutput() < 0) {
       cartRb.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), -ctrTurn.getOutput() * 6));
     } else {
       cartRb.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput() * 6));
     }
   } */

  function startGame(): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ENTER])) {
      GameState.get().gameRunning = true;
    }
  }

  function toHHMMSSMSMS(time: number): string {
    let ms_num = time;

    let hours = Math.floor(ms_num / 360000);
    let minutes = Math.floor((ms_num - (hours * 360000)) / 6000);
    let seconds = Math.floor((ms_num - (hours * 360000) - (minutes * 6000)) / 100);
    let milliSeconds = ms_num - (hours * 360000) - (minutes * 6000) - (seconds * 100);

    let hoursSt: string = hours.toString();
    let minutesSt: string = minutes.toString();
    let secondsSt: string = seconds.toString();
    let milliSecondsSt: string = milliSeconds.toString();


    if (hours < 10) { hoursSt = "0" + hours; }
    if (minutes < 10) { minutesSt = "0" + minutes; }
    if (seconds < 10) { secondsSt = "0" + seconds; }
    if (milliSeconds < 10) { milliSecondsSt = "0" + milliSeconds; }
    return hoursSt + ':' + minutesSt + ':' + secondsSt + ':' + milliSecondsSt;
  }


  function hndCollision(_event: ƒ.EventPhysics) {
    let cp: ƒ.Node = _event.cmpRigidbody.node;


    console.log("passed by", cp.name);
    let index: number = 0;

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


    let counter: number = 0

    cartNode.getComponent(CartCustomComponentScript).cpArray.forEach(element => {
      if (element) counter++;
    });

    if (index == 6 && counter == 0) {
      console.log();
      GameState.get().lapRunning = true;
      GameState.get().laptime = 0;
      console.log("Lap started");
      cartNode.getComponent(CartCustomComponentScript).cpArray[index] = true;
    } else {
      if (cartNode.getComponent(CartCustomComponentScript).cpArray[index - 1] && index > 0) {
        cartNode.getComponent(CartCustomComponentScript).cpArray[index] = true;
      }
      else if (index == 0 && cartNode.getComponent(CartCustomComponentScript).cpArray[cartNode.getComponent(CartCustomComponentScript).cpArray.length - 1]) {
        cartNode.getComponent(CartCustomComponentScript).cpArray[index] = true;
        cartNode.getComponent(CartCustomComponentScript).cpArray[cartNode.getComponent(CartCustomComponentScript).cpArray.length - 1] = false;
      }
      else {
        console.log("Skipped: " + ", Index; " + (index - 1));
        cartNode.getComponent(CartCustomComponentScript).resetLight(index); // currently doesnt work because of physics

      }
    }
    //console.log(cartNode.getComponent(CartCustomComponentScript).cpArray.toString());


  }

  function placeCameraOnCart(): void {
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
}