namespace LaserLeague {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <any>start);

  let agent: Agent;
  let graph: ƒ.Node;
  let countLaserblocks: number = 6;
  let countGoldPoint: number = 8;
  let laserBlocks: ƒ.Node;
  let goldPoints: ƒ.Node;
  let arena: ƒ.Node;
  let copyLaser: ƒ.GraphInstance;


  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL)
  ctrForward.setDelay(200);
  let ctrlRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrlRotation.setDelay(50);

  //let speedAgentTranslation: number = 10; // meters per second

  function start(_event: CustomEvent): void {
    //document.addEventListener("click", hndClick);
    viewport = _event.detail;


    graph = viewport.getBranch();


    //agent = graph.getChildrenByName("Agents")[0].getChildrenByName("agent1")[0];

    laserBlocks = graph.getChildrenByName("Laserformations")[0];
    goldPoints = graph.getChildrenByName("GoldPoints")[0];
    arena = graph.getChildrenByName("Arena")[0].getChildrenByName("Ground")[0];

    let domName: HTMLElement = document.querySelector("#Hud>input");


    addLaser(_event, graph);
    addGolPoints();

    viewport.camera.mtxPivot.translateZ(-50);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    agent = new Agent();
    graph.getChildrenByName("Agents")[0].addChild(agent);
    domName.textContent = agent.name;
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log("graph: ", graph);

    let cmpAudio: ƒ.ComponentAudio = getcmpAudio("sndAtmo2");
    cmpAudio.play(true);

  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    if (GameState.get().gameRunning) {
      checkCollision();
      checkGoldPoints();
      GameState.get().highscore += 1;
      document.querySelector("#info").setAttribute("hidden", "true");
    } else if (!GameState.get().gameRunning) {
      startGame();
      document.querySelector("#info").removeAttribute("hidden");
    }

    if (GameState.get().health <= 0) {
      GameState.get().gameRunning = false;
      document.querySelector("#info").removeAttribute("hidden");
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  /* function hndClick(_event: MouseEvent): void {
    console.log("Click");
    agent.dispatchEvent()
  } */

  function startGame(): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ENTER])) {
      GameState.get().gameRunning = true;
      GameState.get().highscore = 0;
      GameState.get().health = 1;
      addGolPoints();
    }
  }

  async function addLaser(_event: Event, _graph: ƒ.Node) {
    let graphLaser: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-10-28T13:06:41.527Z|18999"]; // get the laser-ressource

    let startPos: ƒ.Vector2 = new ƒ.Vector2(-15, -8);

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < countLaserblocks / 2; j++) {
        copyLaser = await ƒ.Project.createGraphInstance(graphLaser);

        copyLaser.mtxLocal.translation = new ƒ.Vector3(startPos.x + j * 15, startPos.y + i * 16, 0);

        _graph.getChildrenByName("Laserformations")[0].addChild(copyLaser);

        copyLaser.getComponent(laserRotatorScript).speedLaserRotate = ƒ.random.getRange(90, 150);

        if (i > 0) {
          copyLaser.getComponent(laserRotatorScript).speedLaserRotate *= -1;
        }
      }
    }
  }

  async function addGolPoints() {
    goldPoints.removeAllChildren();
    for (let j = 0; j < countGoldPoint; j++) {
      let goldPoint: ƒ.Node = new GoldPoint();
      let arenaY: number = arena.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y / 2;
      let arenaX: number = arena.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2;

      goldPoint.mtxLocal.translation = new ƒ.Vector3(ƒ.random.getRange(-arenaX + 1, arenaX - 1), ƒ.random.getRange(-arenaY + 1, arenaY - 1), 0.1);

      goldPoints.addChild(goldPoint);
    }
  }

  function checkCollision() {
    let _agent: ƒ.Node = agent.getChildren()[0];

    for (let i = 0; i < laserBlocks.getChildren().length; i++) {

      laserBlocks.getChildren()[i].getChildren()[0].getChildren().forEach(element => {
        let beam: ƒ.Node = element;
        let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_agent.mtxWorld.translation, beam.mtxWorldInverse, true);
        let x = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + _agent.radius / 2;
        let y = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + _agent.radius / 2;

        if (posLocal.x <= (x) && posLocal.x >= -(x) && posLocal.y <= y && posLocal.y >= 0) {
          console.log("intersecting");
          GameState.get().health -= 0.1;
          if (GameState.get().highscore >= 500) {
            GameState.get().highscore -= 500;
          } else {
            GameState.get().highscore = 0;
          }

          let cmpAudio: ƒ.ComponentAudio = getcmpAudio("sndHit");
          cmpAudio.play(true);

          _agent.getComponent(agentComponentScript).respawn();
        }
      });
    }
  }

  function checkGoldPoints() {
    let _agent: ƒ.Node = agent.getChildren()[0];

    for (let i = 0; i < goldPoints.getChildren().length; i++) {

      goldPoints.getChildren().forEach(element => {
        let goldPoint: GoldPoint = <GoldPoint>element;
        let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_agent.mtxWorld.translation, goldPoint.mtxWorldInverse, true);
        let x = goldPoint.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + _agent.radius;
        let y = goldPoint.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y / 2 + _agent.radius;

        if (posLocal.x <= (x) && posLocal.x >= -(x) && posLocal.y <= y && posLocal.y >= 0 && !goldPoint.collected) {
          console.log("collected");
          GameState.get().highscore += 600;
          goldPoint.collected = true;
          goldPoint.activate(false);
          let cmpAudio: ƒ.ComponentAudio = getcmpAudio("sndGoldcoin");
          cmpAudio.play(true);
        }
      });
    }
  }

  function getcmpAudio(name: string): ƒ.ComponentAudio {
    let cmpAudios: ƒ.ComponentAudio[] = graph.getComponents(ƒ.ComponentAudio);
    for (let index = 0; index < cmpAudios.length; index++) {
      if (cmpAudios[index].getAudio().name == name) {
        return graph.getComponents(ƒ.ComponentAudio)[index];
      }
    }
    return graph.getComponents(ƒ.ComponentAudio)[1];
  }

}

/* function checkCollisionALT(): void {
    let _agent: ƒ.Node = agent.getChildren()[0];

    for (let i = 0; i < laserBlocks.getChildren().length; i++) {

      laserBlocks.getChildren()[i].getChildren()[0].getChildren().forEach(element => {
        let beam: ƒ.Node = element;
        let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_agent.mtxWorld.translation, beam.mtxWorldInverse, true);
        let maxX: number = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x + _agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2;
        let minX: number = - beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x + _agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2;
        let maxY: number = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y / 2 - _agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2;
        let minY: number = - beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + _agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2;

        if (i = 0) {
          console.log(posLocal);
        }
        if (posLocal.x > minX && posLocal.x < maxX && posLocal.y > maxY && posLocal.y < minY) {
          console.log("intersecting");
          _agent.getComponent(agentComponentScript).respawn();

        } else {
          //console.log("not intersecting");
        }
      });
    }



  } */