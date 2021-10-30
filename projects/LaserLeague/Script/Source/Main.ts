namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <any>start);
  // document.addEventListener("keydown", <EventListener>start);

  //let laserTransform: ƒ.Matrix4x4;
  let agent: ƒ.Node;
  //let laser: ƒ.Node;
  let countLaserblocks: number = 6;
  let laserBlocks: ƒ.Node;
  let beamWidth: number = 0.7;
  let agentRadius: number = 1;
  let beamHeight: number = 6;
  let copyLaser: ƒ.GraphInstance;


  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL)
  ctrForward.setDelay(200);
  let ctrlRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrlRotation.setDelay(50);

  //let speedAgentTranslation: number = 10; // meters per second

  function start(_event: CustomEvent): void {
    viewport = _event.detail;


    let graph: ƒ.Node = viewport.getBranch();

    console.log("graph: ", graph);

    laserBlocks = graph.getChildrenByName("Laserformations")[0];

    agent = graph.getChildrenByName("Agents")[0].getChildrenByName("agent1")[0];


    addLaser(_event, graph);

    viewport.camera.mtxPivot.translateZ(-50);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    checkCollision();

    viewport.draw();

    ƒ.AudioManager.default.update();
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

  

  function checkCollision(): void {

    for (let i = 0; i < laserBlocks.getChildren().length; i++) {

      laserBlocks.getChildren()[i].getChildren()[0].getChildren().forEach(element => {
        let beam: ƒ.Node = element;
        let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);

        /* let minX = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + agent.radius;
        let minY = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + agent.radius;
        //console.log(posLocal.toString()+ beam.name);


        if (posLocal.x <= (minX) && posLocal.x >= -(minX) && posLocal.y <= minY && posLocal.y >= 0) {
          agent.getComponent(agentComponentScript).respwan;
        }
 */
        if (posLocal.x < (- beamWidth / 2 - agentRadius) || posLocal.x > (beamWidth / 2 + agentRadius) || posLocal.y < (agentRadius) || posLocal.y > (beamHeight + agentRadius)) {
          //console.log("not intersecting");
        } else {
          console.log("intersecting");
          agent.getComponent(agentComponentScript).respwan();
        }

      });
    }


  }

  

  /* function altMovement(_event: Event): void {

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000

    let speedAgentTranslation: number = 10; // meters per second

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
        agent.mtxLocal.translateY((speedAgentTranslation * deltaTime * 2) / 3)
      } else {
        agent.mtxLocal.translateY(speedAgentTranslation * deltaTime)
      }

    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
        agent.mtxLocal.translateY((-speedAgentTranslation * deltaTime * 2) / 3)
      } else {
        agent.mtxLocal.translateY(-speedAgentTranslation * deltaTime)
      }

    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
        agent.mtxLocal.translateX((speedAgentTranslation * deltaTime * 2) / 3)
      } else {
        agent.mtxLocal.translateX(speedAgentTranslation * deltaTime)
      }


    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
        agent.mtxLocal.translateX((-speedAgentTranslation * deltaTime * 2) / 3)
      } else {
        agent.mtxLocal.translateX(-speedAgentTranslation * deltaTime)
      }


    }
  } */
}