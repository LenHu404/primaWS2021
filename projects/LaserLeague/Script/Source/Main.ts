namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let transform: ƒ.Matrix4x4;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    let graph: ƒ.Node = viewport.getBranch();
    console.log("graph");
    console.log(graph);

    // console.log(graph.getChildrenByName("Agents"));

    let laser: ƒ.Node = graph.getChildrenByName("Laserformations")[0].getChildrenByName("Laserblock1")[0].getChildrenByName("center")[0];
    transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;

  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used
    transform.rotateZ(3);
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}