namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  enum MoveState {
    forward,
    backwards,
    idle
  }

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  window.addEventListener("load", start);

  let graph: ƒ.Graph;
  let runner: ƒ.Node;
  let floor1: ƒ.Node;
  let floor2: ƒ.Node;
  let sub1: ƒ.Node;
  let sub2: ƒ.Node;
  let matFloor1: ƒ.ComponentMaterial;
  let matFloor2: ƒ.ComponentMaterial;
  let matSub1: ƒ.ComponentMaterial;
  let matSub2: ƒ.ComponentMaterial;
  let band: ƒ.Node;
  let obstacles: ƒ.Node;
  let metercount: number = 0;
  let obstacleDistance: number = 5;
  let lastObstacleSpawnDistance: number = 0;
  let lastObstacleSpawn: number = 0;
  let speed: number = 4;
  let startPoint: number = 30;
  let body: ƒ.Node;
  //let head: ƒ.Node;
  let lLeg: ƒ.Node;
  let rLeg: ƒ.Node;
  let lArm: ƒ.Node;
  let rArm: ƒ.Node;
  let moving: MoveState;
  let timeStamp: number = 0;
  //let dataFile : Datafile;


  async function start(_event: Event): Promise<void> {

    await ƒ.Project.loadResourcesFromHTML();
    graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-01-06T13:14:39.351Z|61391"];

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

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);


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

    runner.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, hndCollision, true)
    //dataFile = new Datafile();
    //dataFile.getData();
    GameState.get().hScore = JSON.parse(localStorage.getItem("HScore"));

    moving = MoveState.forward;
    //instaniateObstacles();
    //viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
    ƒ.Physics.adjustTransforms(graph);
    ƒ.AudioManager.default.listenTo(graph);
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    
    ƒ.Physics.world.simulate(Math.min(0.1, deltaTime));  // if physics is included and used
    deleteUnseenObstacle();
    if (GameState.get().gameRunning) {
      document.querySelector("#info").setAttribute("hidden", "true");
      //instaniateObstacles();
      matFloor1.mtxPivot.translateX(0.075 * deltaTime * speed);
      matFloor2.mtxPivot.translateX(0.075 * deltaTime * speed);
      matSub1.mtxPivot.translateX(0.025 * deltaTime * speed);
      matSub2.mtxPivot.translateX(-0.025 * deltaTime * speed);
      band.mtxLocal.translateZ(-1.5 * deltaTime * speed);
      metercount += 1.5 * deltaTime * speed;
      timeStamp += 1 * deltaTime;
      console.log("timestamp", metercount);
      animation();
      GameState.get().score += 1;
      spawingObstacles();
      speed += 0.001;
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

    let startPos: ƒ.Vector3 = new ƒ.Vector3(0, 0, metercount + 4);

    let treeInstance = await ƒ.Project.createGraphInstance(treeBlueprint);

    treeInstance.mtxLocal.translation = startPos;

    obstacles.addChild(treeInstance);

    let StoneBlueprint: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2022-01-11T13:55:46.329Z|17331"];

    startPos = new ƒ.Vector3(3, 0, metercount + 6);

    let stoneInstance = await ƒ.Project.createGraphInstance(StoneBlueprint);

    stoneInstance.mtxLocal.translation = startPos;

    obstacles.addChild(stoneInstance);

    let treeStumpBlueprint: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2022-01-11T13:55:41.283Z|27993"];

    startPos = new ƒ.Vector3(-2, 0, metercount + 15);

    let treeStumpInstance = await ƒ.Project.createGraphInstance(treeStumpBlueprint);

    treeStumpInstance.mtxLocal.translation = startPos;

    obstacles.addChild(treeStumpInstance);
  }

  async function instaniateTree(): Promise<void> {

    let treeBlueprint: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2022-01-11T13:55:44.114Z|12001"];

    let startPos = new ƒ.Vector3(Math.random() * 6 - 3, 0, metercount + startPoint);

    let treeInstance = await ƒ.Project.createGraphInstance(treeBlueprint);

    treeInstance.mtxLocal.translation = startPos;
    treeInstance.mtxLocal.rotateY(Math.random() * 360);

    obstacles.addChild(treeInstance);

  }

  async function instaniateStone(): Promise<void> {

    let StoneBlueprint: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2022-01-11T13:55:46.329Z|17331"];

    let startPos = new ƒ.Vector3(Math.random() * 6 - 3, 0, metercount + startPoint);

    let stoneInstance = await ƒ.Project.createGraphInstance(StoneBlueprint);

    stoneInstance.mtxLocal.translation = startPos;
    stoneInstance.mtxLocal.rotateY(Math.random() * 360);

    obstacles.addChild(stoneInstance);

  }

  async function instaniateStump(): Promise<void> {

    let treeStumpBlueprint: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2022-01-11T13:55:41.283Z|27993"];

    let startPos = new ƒ.Vector3(Math.random() * 4 - 2, 0, metercount + startPoint);

    let treeStumpInstance = await ƒ.Project.createGraphInstance(treeStumpBlueprint);

    treeStumpInstance.mtxLocal.translation = startPos;
    treeStumpInstance.mtxLocal.rotateY(Math.random() * 360);
    obstacles.addChild(treeStumpInstance);

  }

  async function instaniateCoin(): Promise<void> {

    let CoinBlueprint: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2022-01-18T14:20:00.545Z|93108"];

    let startPos = new ƒ.Vector3(Math.random() * 4 - 3, 0, metercount + startPoint);

    let CoinInstance = await ƒ.Project.createGraphInstance(CoinBlueprint);

    CoinInstance.mtxLocal.translation = startPos;
    CoinInstance.mtxLocal.rotateY(Math.random() * 360);
    obstacles.addChild(CoinInstance);

  }

  function startGame(): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ENTER])) {
      GameState.get().gameRunning = true;
      GameState.get().score = 0;
      GameState.get().health1 = true;
      GameState.get().health2 = true;
      GameState.get().health3 = true;
      GameState.get().setHealth();
      obstacleDistance = 5;
      band.mtxLocal.translation = new ƒ.Vector3(0, 0, 0);
      metercount = 0;
      lastObstacleSpawnDistance = 0;
      lastObstacleSpawn = 0;
      speed = 4;
    }


  }

  function hndCollision(_event: ƒ.EventPhysics) {
    //console.log("called");
    if (GameState.get().gameRunning) {
      let obstacle: ƒ.Node = _event.cmpRigidbody.node;
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
        console
        GameState.get().score += 10000;
      } else {
        reset();
        if (GameState.get().hit() == 0) {
          GameState.get().gameRunning = false;
          console.log("Score: " + GameState.get().score)
          //dataFile.save();
          localStorage.setItem("HScore", JSON.stringify(GameState.get().score));
          if (GameState.get().score > GameState.get().hScore) {
            GameState.get().hScore = GameState.get().score;
          }
        }
      }

      //console.log( GameState.get().health);
    }

  }

  function deleteUnseenObstacle(): void {

    obstacles.getChildren().forEach(obstacle => {
      //console.log(obstacle.name, obstacle.mtxWorld.translation.z);
      if (obstacle.mtxWorld.translation.z < -4) {
        for (const node of obstacle.getIterator()) {
          if (node.getComponent(ƒ.ComponentMaterial)) {
            node.getComponent(ƒ.ComponentMaterial).sortForAlpha = true;
            node.getComponent(ƒ.ComponentMaterial).material;
          }
          node.activate(false);
        }
        obstacles.removeChild(obstacle);
        //console.log("graph", obstacles);
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

  function reset(): void {

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

  function spawingObstacles(): void {
    if (lastObstacleSpawnDistance >= obstacleDistance) {
      let randomObstacle: number = Math.random();
      if (randomObstacle < 0.3) {
        instaniateTree();
      } else if (randomObstacle > 0.8) {
        instaniateStump();
      } else {
        instaniateStone();
      }
      //instaniateObstacles()
      lastObstacleSpawnDistance = 0
      lastObstacleSpawn = metercount;
      if (obstacleDistance > 2.5)
        obstacleDistance -= 0.01;
    }
    else lastObstacleSpawnDistance = metercount - lastObstacleSpawn

    if (Math.random() > 0.9) {
      if (Math.random() > 0.9) {
        if (Math.random() > 0.9) {
          instaniateCoin();
        }
      }
    }
  }

  function sin(x: number): number {
    return Math.sin(7 * x);
  }


  function animation(): void {
    let rotation: number = map_range(sin(timeStamp), 1, 0, -50, 0);
    if (moving == MoveState.forward) {
      console.log("timestamp", timeStamp);
      console.log("sin", sin(timeStamp));
      console.log("rotation: ", rotation);
      lLeg.mtxLocal.rotation = new ƒ.Vector3(rotation, 0, 0);
      rLeg.mtxLocal.rotation = new ƒ.Vector3(-rotation, 0, 0);
      lArm.mtxLocal.rotation = new ƒ.Vector3(-rotation, 0, 0);
      rArm.mtxLocal.rotation = new ƒ.Vector3(rotation, 0, 0);
    }
  }

  function map_range(v: number, from_min: number, from_max: number, to_min: number, to_max: number): number {
    return to_min + (v - from_min) * (to_max - to_min) / (from_max - from_min);
}
}