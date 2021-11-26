namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  let viewportMinimap: ƒ.Viewport;
  let graph: ƒ.Graph;
  let cart: ƒ.Node;
  let cartNode: ƒ.Node;
  let minimapNode: ƒ.Node;
  let checkpoints: ƒ.Node;
  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;
  //let runningLap: boolean = false;

  let cameraNode: ƒ.Node = new ƒ.Node("cameraNode");
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
    checkpoints = graph.getChildrenByName("Terrain")[0].getChildrenByName("Checkpoints")[0];

    cartNode.getComponent(CartCustomComponentScript).cpArray = new Array<boolean>(checkpoints.nChildren).fill(true);
    console.log("array ", cartNode.getComponent(CartCustomComponentScript).cpArray);
    cartNode.mtxLocal.translation = new ƒ.Vector3(-16, 3.0000, -34.5);
    cartNode.mtxLocal.rotation = new ƒ.Vector3(0, -90, 0);

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

    //cameraNode.mtxLocal.translation = cart.mtxWorld.translation;
    //cameraNode.mtxLocal.rotation = new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0);
    placeCameraOnCart();
    placeCartOnTerrain();





    for (let index = 0; index < checkpoints.nChildren; index++) {
      checkCollision(cartNode, checkpoints.getChildren()[index]);
      //console.log("name ", checkpoints.getChildren()[index]);
    }






    GameState.get().laptime += 1;
    //ƒ.Time.
    GameState.get().laptimeString = toHHMMSSMSMS(GameState.get().laptime);
    if (!GameState.get().gameRunning) {
      GameState.get().laptimeString = "-- : -- : -- : --";
    }
    let counter: number = 0;

    for (let i = 0; i < cartNode.getComponent(CartCustomComponentScript).cpArray.length; i++) {
      if (cartNode.getComponent(CartCustomComponentScript).cpArray[i]) {
        counter++;
      }      
    }

    if (counter == cartNode.getComponent(CartCustomComponentScript).cpArray.length) {
      GameState.get().laps++;
      cartNode.getComponent(CartCustomComponentScript).cpArray.fill(false);
      console.log("Laptime: ",GameState.get().laptimeString);
      GameState.get().laptime = 0;
    }

    GameState.get().lapprogress = counter/7;



    viewportMinimap.draw();
    viewport.draw();
    ƒ.AudioManager.default.update();
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

  function checkCollision(collider: ƒ.Node, obstacle: ƒ.Node) {
    let distance: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(collider.mtxWorld.translation, obstacle.mtxWorldInverse, true);
    let minX = obstacle.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + collider.radius;
    let minY = obstacle.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + collider.radius;

    if (distance.x <= (minX) && distance.x >= -(minX) && distance.y <= minY && distance.y >= 0) {
      console.log("passed by", obstacle.name);
      let index: number = 0;

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
          if (!cartNode.getComponent(CartCustomComponentScript).cpArray[0]) {
            GameState.get().gameRunning = true;
            GameState.get().laptime = 0;
          }
          break;
        default:
          break;
      }

      if (cartNode.getComponent(CartCustomComponentScript).cpArray[index - 1]) {
        cartNode.getComponent(CartCustomComponentScript).cpArray[0] = true;
      }
      else {
        console.log("Skipped CP: " + (index));
        cartNode.getComponent(CartCustomComponentScript).resetLight(index);
       
      }

    }
  }


  function placeCameraOnCart(): void {
    cameraNode.mtxLocal.mutate({
      translation: cart.mtxWorld.translation,
      rotation: new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0),
    });
  }

  function placeCartOnTerrain(): void {
    let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(cartNode.mtxLocal.translation, mtxTerrain);
    cartNode.mtxLocal.translation = terrainInfo.position;
    cartNode.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cartNode.mtxLocal.getZ()), terrainInfo.normal);
  }
}