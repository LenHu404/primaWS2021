namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class CartCustomComponentScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CartCustomComponentScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CustomComponentScript added to ";

    public lapProgress: number = 0;
    public lapTime: number = 0;
    public ctrForward: ƒ.Control;
    public ctrTurn: ƒ.Control;
    public cpArray: boolean[];




    constructor() {
      super();

      this.ctrForward = new ƒ.Control("Forward", 50, ƒ.CONTROL_TYPE.PROPORTIONAL);
      this.ctrForward.setDelay(1000);
      this.ctrTurn = new ƒ.Control("Turn", 100, ƒ.CONTROL_TYPE.PROPORTIONAL);
      this.ctrTurn.setDelay(80);

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
          ƒ.Debug.log(this.message, this.node.name);
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          //ƒ.Debug.log(this.message, this.getContainer());
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }

    public update = (_event: Event) => {

      this.cartControlls(_event)

    }

    public reset = (): void => {
      this.node.mtxLocal.translation = new ƒ.Vector3(-16, 3.0000, -34.5);
      this.node.mtxLocal.rotation = new ƒ.Vector3(0, -90, 0);
      this.ctrForward.setDelay(0);
      this.ctrForward.setInput(0);
      this.ctrTurn.setInput(0);
      this.ctrForward.setDelay(1000);
      this.ctrTurn.setInput(80);
      this.cpArray.fill(false);
    }

    public resetLight = (cpNumber: number): void => {
      console.log("Reset to CP"+ cpNumber);
      switch (cpNumber) {
        case 1:
          this.node.mtxLocal.translation = new ƒ.Vector3(-41.3, 0, 1);
          this.node.mtxLocal.rotation = new ƒ.Vector3(0,0, 0);
          break;
        case 2:
          this.node.mtxLocal.translation = new ƒ.Vector3(-37, 0, 33);
          this.node.mtxLocal.rotation = new ƒ.Vector3(0, 45, 0);
          break;
        case 3:
          this.node.mtxLocal.translation = new ƒ.Vector3(8.4, 0, 36.2);
          this.node.mtxLocal.rotation = new ƒ.Vector3(0, 135, 0);
          break;
        case 4:
          this.node.mtxLocal.translation = new ƒ.Vector3(-17.3, 0, 5);
          this.node.mtxLocal.rotation = new ƒ.Vector3(0, -180, 0);
          break;
        case 5:
          this.node.mtxLocal.translation = new ƒ.Vector3(29.7, 0, 12);
          this.node.mtxLocal.rotation = new ƒ.Vector3(0, 90, 0);
          break;
        case 6:
          this.node.mtxLocal.translation = new ƒ.Vector3(35, 3, -31);
          this.node.mtxLocal.rotation = new ƒ.Vector3(0, 225, 0);
          break;
        case 7:
          this.node.mtxLocal.translation = new ƒ.Vector3(-16, 3.0000, -34.5);
          this.node.mtxLocal.rotation = new ƒ.Vector3(0, -90, 0);
          break;

        default:
          break;
      }
      this.ctrForward.setDelay(0);
      this.ctrForward.setInput(0);
      this.ctrTurn.setInput(0);
      this.ctrForward.setDelay(1000);
      this.ctrTurn.setInput(80);
    }

    public cartControlls = (_event: Event) => {
      let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

      let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
      this.ctrTurn.setInput(turn * deltaTime);
      if (this.ctrForward.getOutput() < 0) {
        this.node.mtxLocal.rotateY(-this.ctrTurn.getOutput());
      } else {
        this.node.mtxLocal.rotateY(this.ctrTurn.getOutput());
      }
      

      let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
      this.ctrForward.setInput(forward * deltaTime);
      this.node.mtxLocal.translateZ(this.ctrForward.getOutput());

      let speed :number = this.ctrForward.getOutput().valueOf();

      

      let speedTacho = this.map_range(speed, 0, 0.85, 0, 270);

      

      if (speed > 0) {
        document.getElementById("needle").style.transform = "rotate(" + (-speedTacho + 45)+ "deg)";
        GameState.get().speed = speed.toFixed(2) + " m/s";
      } else {
        document.getElementById("needle").style.transform = "rotate(" + (speedTacho + 45)+ "deg)";
        GameState.get().speed = -speed.toFixed(2) + " m/s";
      }
      
    }

    public map_range (v: number, from_min: number, from_max:number, to_min: number, to_max: number): number {
      return to_min + (v - from_min) * (to_max - to_min) / (from_max - from_min);
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}