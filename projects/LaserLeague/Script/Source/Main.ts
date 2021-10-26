namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  // document.addEventListener("keydown", <EventListener>start);

  let transform: ƒ.Matrix4x4;
  let agent: ƒ.Node;
  let laser: ƒ.Node;
  let beamWidth: number = 0.7;
  let agentRadius: number = 0.5;
  let beamHeight: number = 6;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL)
  ctrForward.setDelay(200);

  //let speedAgentTranslation: number = 10; // meters per second

  function start(_event: CustomEvent): void {
    viewport = _event.detail;



    let graph: ƒ.Node = viewport.getBranch();
    console.log("graph");
    console.log(graph);

    // console.log(graph.getChildrenByName("Agents"));

    laser = graph.getChildrenByName("Laserformations")[0].getChildrenByName("Laserblock1")[0];
    transform = laser.getChildren()[0].getComponent(ƒ.ComponentTransform).mtxLocal;

    agent = graph.getChildrenByName("Agents")[0].getChildrenByName("agent1")[0];

    


    viewport.camera.mtxPivot.translateZ(-50);


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000

    movement(_event, deltaTime);

    let speedLaserRotate: number = 120; // degrees per second
    transform.rotateZ(speedLaserRotate * deltaTime);

    viewport.draw();

    checkCollision();

    ƒ.AudioManager.default.update();
  }

  function movement(_event: Event, _deltaTime: number): void {

    //let speedAgentTranslation: number = 10; // meters per second
    let speedAgentRotation: number = 360; // meters per second

    let value: number = (
      ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
      + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
    )
    ctrForward.setInput(value * _deltaTime);
    agent.mtxLocal.translateY(ctrForward.getOutput());

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
      agent.mtxLocal.rotateZ(speedAgentRotation * _deltaTime);
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
      agent.mtxLocal.rotateZ(-speedAgentRotation * _deltaTime);

  }

  function checkCollision(): void {

    laser.getChildren()[0].getChildren().forEach(element => {
      let beam: ƒ.Node = element;
      let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
      //console.log(posLocal.toString()+ beam.name);

      if (posLocal.x < ( - beamWidth/2 - agentRadius) || posLocal.x > (beamWidth/2 + agentRadius) || posLocal.y < (agentRadius) || posLocal.y > (beamHeight + agentRadius)) {
        //console.log("not intersecting");
      } else {
        console.log("intersecting");
      }

    });
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