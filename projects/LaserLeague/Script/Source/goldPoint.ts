namespace LaserLeague {
    import ƒ = FudgeCore;

    export class GoldPoint extends ƒ.Node {

        public collected: boolean = false;

        constructor() {

            super("goldPoint");
            this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad("MeshAgnt")));
            this.addComponent(new ƒ.ComponentMaterial(
                new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("yellow", 1))))
            );
            this.mtxLocal.translateZ(1);
            this.mtxLocal.translateY(20);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }
        public update = (_event: Event) => {
        }
    }
}
