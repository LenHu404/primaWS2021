namespace LaserLeague {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(LaserLeague);  // Register the namespace to FUDGE for serialization

  export class agentComponentScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CustomComponentScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "agentComponentScript added to ";

    public ctrForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL)
    public ctrlRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
    public agentDiameter: number = 2;

    constructor() {
      super();

      this.ctrForward.setDelay(200);

      this.ctrlRotation.setDelay(50);



      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);

    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event) => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Debug.log(this.message, this.node);
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }

    public update = (_event: Event) => {
      this.movement(_event)
    }

    public respawn = (): void => {
      this.node.mtxLocal.translation = new ƒ.Vector3(0, 0, 1);
      this.ctrForward.setDelay(0);
      this.ctrForward.setInput(0);
      this.ctrlRotation.setInput(0);
      this.ctrForward.setDelay(200);
      this.node.mtxLocal.rotation = new ƒ.Vector3(0, 0, 0);
    }

    public movement = (_event: Event): void => {
      let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

      let speedAgentTranslation: number = 10; // meters per second
      let speedAgentRotation: number = 360; // meters per second

      let speedValue: number = (
        ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
        + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
      )
      this.ctrForward.setInput(speedValue * deltaTime);
      this.node.mtxLocal.translateY(this.ctrForward.getOutput() * speedAgentTranslation);

      let rotationValue: number = (
        ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
        + (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));

      this.ctrlRotation.setInput(rotationValue * deltaTime);
      this.node.mtxLocal.rotateZ(this.ctrlRotation.getOutput() * speedAgentRotation);

      let agentRadius: number = this.node.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x/2;


      //let groundScale: ƒ.Vector2 = new ƒ.Vector2()


      let currPos: ƒ.Vector3 = this.node.mtxLocal.translation;
      //console.log(agent.mtxLocal.translation.toString());

      if (this.node.mtxLocal.translation.x + agentRadius > 24.5) {
        //console.log("+x");
        this.node.mtxLocal.translation = new ƒ.Vector3(-24.5 + agentRadius, currPos.y, currPos.z);
      }
      if (this.node.mtxLocal.translation.x - agentRadius < -24.5) {
        //console.log("-x");
        this.node.mtxLocal.translation = new ƒ.Vector3(24.5 - agentRadius, currPos.y, currPos.z);
      }

      if (this.node.mtxLocal.translation.y + agentRadius > 14.75) {
        //console.log("+y");
        this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x, -14.75 + agentRadius, currPos.z);
      }
      if (this.node.mtxLocal.translation.y - agentRadius< -14.75) {
        //console.log("-y");
        this.node.mtxLocal.translation = new ƒ.Vector3(currPos.x, 14.75 - agentRadius, currPos.z);
      }
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }

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


}