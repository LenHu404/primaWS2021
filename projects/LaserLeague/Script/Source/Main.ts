namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  // document.addEventListener("keydown", <EventListener>start);

  let transform: ƒ.Matrix4x4;
  let agent: ƒ.Node;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;



    let graph: ƒ.Node = viewport.getBranch();
    console.log("graph");
    console.log(graph);

    // console.log(graph.getChildrenByName("Agents"));

    let laser: ƒ.Node = graph.getChildrenByName("Laserformations")[0].getChildrenByName("Laserblock1")[0].getChildrenByName("center")[0];

    agent = graph.getChildrenByName("Agents")[0].getChildrenByName("agent1")[0];

    transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;


    viewport.camera.mtxPivot.translateZ(-50);


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    movement(_event);



    let speedLaserRotate: number = 120; // degrees per second
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000
    transform.rotateZ(speedLaserRotate * deltaTime);

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function movement(_event: Event): void {

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000

    let speedAgentTranslation: number = 10; // meters per second
    //let speedAgentRotation: number = 360; // meters per second

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])){
        agent.mtxLocal.translateY((speedAgentTranslation * deltaTime*2)/3)
      } else {
        agent.mtxLocal.translateY(speedAgentTranslation * deltaTime)
      }
      
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])){
        agent.mtxLocal.translateY((-speedAgentTranslation * deltaTime*2)/3)
      } else {
        agent.mtxLocal.translateY(-speedAgentTranslation * deltaTime)
      }
      
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])){
        agent.mtxLocal.translateX((speedAgentTranslation * deltaTime*2)/3)
      } else {
        agent.mtxLocal.translateX(speedAgentTranslation * deltaTime)
      }

      
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])){
        agent.mtxLocal.translateX((-speedAgentTranslation * deltaTime*2)/3)
      } else {
        agent.mtxLocal.translateX(-speedAgentTranslation * deltaTime)
      }

      
    }
  }
}