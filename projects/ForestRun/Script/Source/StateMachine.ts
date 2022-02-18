namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export enum JOB {
    IDLE, ESCAPE, DIE, RESPAWN
  }

  export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(StateMachine);
    private static instructions: ƒAid.StateMachineInstructions<JOB> = StateMachine.get();
    public speedIdle: number = 10;
    public speedEscape: number = 15;
    public torqueIdle: number = 5;
    private timeStamp: number = 0;
    private cmpBody: ƒ.ComponentRigidbody;
    private cmpMaterial: ƒ.ComponentMaterial;
    private deltaTime: number = 0;
    private cmpTransform: ƒ.ComponentTransform;


    constructor() {
      super();
      this.instructions = StateMachine.instructions; // setup instructions with the static set

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    public static get(): ƒAid.StateMachineInstructions<JOB> {
      let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
      setup.transitDefault = StateMachine.transitDefault;
      setup.actDefault = StateMachine.actDefault;
      setup.setAction(JOB.IDLE, <ƒ.General>this.actIdle);
      setup.setAction(JOB.ESCAPE, <ƒ.General>this.actEscape);
      setup.setAction(JOB.DIE, <ƒ.General>this.actDie);
      setup.setAction(JOB.RESPAWN, <ƒ.General>this.actRespawn);
      setup.setTransition(JOB.ESCAPE, JOB.DIE, <ƒ.General>this.transitDie);
      return setup;
    }

    private static transitDefault(_machine: StateMachine): void {
      console.log("Transit to", _machine.stateNext);
    }

    private static async actDefault(_machine: StateMachine): Promise<void> {
      console.log(JOB[_machine.stateCurrent]);
      //console.log("position", _machine.node.mtxLocal.translation.toString());


      let currPos: ƒ.Vector3 = _machine.node.mtxLocal.translation;
      _machine.timeStamp += 1 * _machine.deltaTime;
      _machine.cmpTransform.mtxLocal.translation = new ƒ.Vector3(StateMachine.sinHorizontal(_machine.timeStamp), StateMachine.sin(_machine.timeStamp) + 0.5, currPos.z);

    }

    private static async actIdle(_machine: StateMachine): Promise<void> {
      if (GameState.get().gameRunning) {
        _machine.cmpTransform.mtxLocal.translateZ(_machine.speedIdle * _machine.deltaTime);
      }
      StateMachine.actDefault(_machine);
    }

    private static async actEscape(_machine: StateMachine): Promise<void> {
      _machine.cmpTransform.mtxLocal.translateZ(_machine.speedEscape * _machine.deltaTime);
    }

    private static async actDie(_machine: StateMachine): Promise<void> {
      _machine.transit(JOB.IDLE);
    }

    private static transitDie(_machine: StateMachine): void {
      _machine.transit(JOB.RESPAWN);

    }

    private static actRespawn(_machine: StateMachine): void {
      _machine.cmpTransform.mtxLocal.translation = new ƒ.Vector3(0, 0, 5);
      _machine.transit(JOB.IDLE);
    }

    // Activate the functions of this component as response to events
    private hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          this.transit(JOB.IDLE);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          this.cmpBody = this.node.getComponent(ƒ.ComponentRigidbody);
          this.cmpMaterial = this.node.getComponent(ƒ.ComponentMaterial);
          this.cmpTransform = this.node.getComponent(ƒ.ComponentTransform);
          this.cmpBody.addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, (_event: ƒ.EventPhysics) => {
            if (_event.cmpRigidbody.node.name == "runner")
              this.transit(JOB.DIE);
          });
          let trigger: ƒ.ComponentRigidbody = this.node.getChildren()[0].getComponent(ƒ.ComponentRigidbody);
          trigger.addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, (_event: ƒ.EventPhysics) => {
            //console.log("TriggerEnter", _event.cmpRigidbody.node.name);
            if (_event.cmpRigidbody.node.name == "runner" && this.stateCurrent != JOB.DIE)
              this.transit(JOB.ESCAPE);
          });
          trigger.addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_EXIT, (_event: ƒ.EventPhysics) => {
            if (this.stateCurrent == JOB.ESCAPE)
              this.transit(JOB.IDLE);
          });
          break;
      }
    }

    private update = (_event: Event): void => {
      this.act();
      this.deltaTime = this.deltaTime = ƒ.Loop.timeFrameReal / 1000;
    }

    private static sin = (x: number): number => {
      return Math.sin(Math.PI * x) * 0.3;
    }

    private static sinHorizontal = (x: number): number => {
      return Math.sin(1 * x) * 2;
    }

  }
}