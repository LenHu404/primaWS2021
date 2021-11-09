namespace LaserLeague {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <any>start);
  // document.addEventListener("keydown", <EventListener>start);

  //let laserTransform: ƒ.Matrix4x4;
  let agent: Agent;
  let graph: ƒ.Node;
  //let goldPoint: GoldPoint;
  //let laser: ƒ.Node;
  let countLaserblocks: number = 6;
  let laserBlocks: ƒ.Node;
  /* let beamWidth: number = 6;
  let beamHeight: number = 0.7;
  let agentRadius: number = 1; */
  let copyLaser: ƒ.GraphInstance;


  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL)
  ctrForward.setDelay(200);
  let ctrlRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrlRotation.setDelay(50);

  //let speedAgentTranslation: number = 10; // meters per second

  function start(_event: CustomEvent): void {
    viewport = _event.detail;


    graph = viewport.getBranch();


    //agent = graph.getChildrenByName("Agents")[0].getChildrenByName("agent1")[0];

    laserBlocks = graph.getChildrenByName("Laserformations")[0];

    agent = new Agent();
    //goldPoint = new GoldPoint();

    graph.getChildrenByName("Agents")[0].addChild(agent);

    //graph.getChildrenByName("GoldPoints")[0].addChild(goldPoint);


    let domName: HTMLElement = document.querySelector("#Hud>input");
    domName.textContent = agent.name;

    addLaser(_event, graph);

    viewport.camera.mtxPivot.translateZ(-50);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log("graph: ", graph);
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    checkCollision();

    viewport.draw();
    /*agent.Health -= 0.001;
   let domHealth: HTMLInputElement = document.querySelector("input");
   domHealth.value = agent.Health.toString(); */

    ƒ.AudioManager.default.update();

    GameState.get().highscore += 1;
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
          GameState.get().health -= 0.05;
          //GameState.get().highscore -= 500;
          let cmpAudio: ƒ.ComponentAudio = graph.getComponents(ƒ.ComponentAudio)[1];
          cmpAudio.play(true);

          _agent.getComponent(agentComponentScript).respawn();
        }
      });
    }
  }

  /* function getcmpAudio(name: string): ƒ.ComponentAudio {
    let cmpAudios: ƒ.ComponentAudio[] = graph.getComponents(ƒ.ComponentAudio);
    let cmpAudio: ƒ.ComponentAudio;
    cmpAudios.forEach(element => {
      if (element.getAudioNode.name)
    });
    for (let i: number = 0; i < cmpAudios.length; i++) {
      if ()
    }
    return  
 } */

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