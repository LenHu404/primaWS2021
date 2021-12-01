namespace Script {
  import ƒ = FudgeCore;


  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let ground: ƒ.Node;
  let ball: ƒ.Node;
  let ballRb: ƒ.ComponentRigidbody;
  let cmpBall: ƒ.ComponentRigidbody;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let ctrForward: ƒ.Control;
  let ctrTurn: ƒ.Control;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();

    ƒ.Physics.adjustTransforms(graph);

    ground = graph.getChildrenByName("Ground")[0];
    ball = graph.getChildrenByName("Ball")[0];

    ballRb = ball.getComponent(ƒ.ComponentRigidbody);


    ctrForward = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
    ctrForward.setDelay(1000);
    ctrTurn = new ƒ.Control("Turn", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
    ctrTurn.setDelay(80);

    

    /*  ground.addComponent(new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_1));
 
     //ball.addComponent(new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.SPHERE, ƒ.COLLISION_GROUP.GROUP_1));
 
     cmpBall = new ƒ.ComponentRigidbody(80, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CAPSULE, ƒ.COLLISION_GROUP.DEFAULT);
     cmpBall.restitution = 0;
     ball.addComponent(cmpBall); */



    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    ƒ.Physics.world.simulate(Math.min(0.1, ƒ.Loop.timeFrameReal / 1000));  // if physics is included and used
   // let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    
    ctrTurn.setInput(turn);
    
    ballRb.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(),ctrTurn.getOutput()));
    


    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    ballRb.applyForce(ƒ.Vector3.SCALE(ball.mtxLocal.getZ(),ctrForward.getOutput()));

    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}