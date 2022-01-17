namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  window.addEventListener("load", start);

  let graph: ƒ.Graph;
  let runner: ƒ.Node;
  let floor: ƒ.Node;
  let matFloor: ƒ.ComponentMaterial;
  let band: ƒ.Node;
  let obstacles: ƒ.Node;
  let metercount: number = 0;


  async function start(_event: Event): Promise<void> {

    await ƒ.Project.loadResourcesFromHTML();
    graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-01-06T13:14:39.351Z|61391"];

    let cmpCamera = new ƒ.ComponentCamera();
    cmpCamera.mtxPivot.rotateY(25);
    cmpCamera.mtxPivot.translateZ(-17);
    cmpCamera.mtxPivot.translateY(5);
    cmpCamera.mtxPivot.translateX(2);

    cmpCamera.mtxPivot.rotateX(10);
    graph.addComponent(cmpCamera);

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);


    floor = graph.getChildrenByName("Laufband")[0].getChildrenByName("Boden")[0];
    matFloor = floor.getComponent(ƒ.ComponentMaterial);

    band = graph.getChildrenByName("Laufband")[0].getChildrenByName("Band")[0];
    runner = graph.getChildrenByName("Laeufer")[0];

    obstacles = graph.getChildrenByName("Laufband")[0].getChildrenByName("Band")[0].getChildrenByName("Hindernisse")[0];

    runner.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, hndCollision, true)

    instaniateObstacles();
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
    ƒ.Physics.adjustTransforms(graph);
    ƒ.AudioManager.default.listenTo(graph);
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    ƒ.Physics.world.simulate(Math.min(0.1, deltaTime));  // if physics is included and used
    deleteUnseemObstacle();
    if (GameState.get().gameRunning) {
      document.querySelector("#info").setAttribute("hidden", "true");
      //instaniateObstacles();
      matFloor.mtxPivot.translateX(0.05 * deltaTime);
      band.mtxLocal.translateZ(-1 * deltaTime);
      metercount += -1 * deltaTime;
      GameState.get().score = <number><unknown>(-metercount*100).toFixed(0);
    } else if (!GameState.get().gameRunning) {
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

  async function instaniateObstacles(): Promise<void> {

    let treeBlueprint: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2022-01-11T13:55:44.114Z|12001"];

    let startPos: ƒ.Vector3 = new ƒ.Vector3(0, 0,-metercount + 4);

    let treeInstance = await ƒ.Project.createGraphInstance(treeBlueprint);

    treeInstance.mtxLocal.translation = startPos;

    obstacles.addChild(treeInstance);

    let StoneBlueprint: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2022-01-11T13:55:46.329Z|17331"];

    startPos = new ƒ.Vector3(3, 0, -metercount +6);

    let stoneInstance = await ƒ.Project.createGraphInstance(StoneBlueprint);

    stoneInstance.mtxLocal.translation = startPos;

    obstacles.addChild(stoneInstance);

    let treeStumpBlueprint: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2022-01-11T13:55:41.283Z|27993"];

    startPos = new ƒ.Vector3(-2, 0,-metercount + 15);

    let treeStumpInstance = await ƒ.Project.createGraphInstance(treeStumpBlueprint);

    treeStumpInstance.mtxLocal.translation = startPos;

    obstacles.addChild(treeStumpInstance);
  }

  async function instaniateTree(): Promise<void> {

    let treeBlueprint: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2022-01-11T13:55:44.114Z|12001"];

    let startPos: ƒ.Vector3 = new ƒ.Vector3(3, 0, -metercount + 4);

    let treeInstance = await ƒ.Project.createGraphInstance(treeBlueprint);

    treeInstance.mtxLocal.translation = startPos;

    obstacles.addChild(treeInstance);

  }

  function startGame(): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ENTER])) {
      GameState.get().gameRunning = true;
    }
  }

  function hndCollision(_event: ƒ.EventPhysics) {
    //console.log("called");
    if (GameState.get().gameRunning) {
      let obstacle: ƒ.Node = _event.cmpRigidbody.node;
      console.log(obstacle.name);
      if (obstacle.getParent().name != "Hindernisse"){
        obstacle = obstacle.getParent();
      }
      for (const node of obstacle.getIterator()) {
        if(node.getComponent(ƒ.ComponentRigidbody)){
           node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
        }
        node.activate(false);
      }
      obstacles.removeChild(obstacle);
      //reset();
      GameState.get().health -= 1;
      //console.log( GameState.get().health);
    }

  }
  function deleteUnseemObstacle(): void {
    obstacles.getChildren().forEach(obstacle => {
      //console.log(obstacle.name, obstacle.mtxWorld.translation.z);
      if (obstacle.mtxWorld.translation.z < -10) {
        for (const node of obstacle.getIterator()) {
          if(node.getComponent(ƒ.ComponentRigidbody)){
             node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
          }
          node.activate(false);
        }
        obstacles.removeChild(obstacle);
        //console.log("graph", obstacles);
      }
    });
  }

  function reset(): void {
    
    obstacles.getChildren().forEach(obstacle => {
      //console.log(obstacle.name, obstacle.mtxWorld.translation.z);
      if (obstacle.mtxWorld.translation.z > -5 &&  obstacle.mtxWorld.translation.z < 5) {
        for (const node of obstacle.getIterator()) {
          if(node.getComponent(ƒ.ComponentRigidbody)){
             node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
          }
          node.activate(false);
        }
        obstacles.removeChild(obstacle);
        
        //console.log("graph", obstacles);
      }
    });
    runner.mtxLocal.translation= new ƒ.Vector3(0,0,0);

  }
}