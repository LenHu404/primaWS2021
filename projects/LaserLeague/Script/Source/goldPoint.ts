namespace LaserLeague {
    import ƒ = FudgeCore;

    export class GoldPoint extends ƒ.Node {

        constructor() {

            super("goldPoint");
            this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad("MeshAgnt")));
            this.addComponent(new ƒ.ComponentMaterial(
                new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0, 1, 1, 1))))
            );
            this.mtxLocal.translateZ(1);
            //this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(ƒ.Vector3.ONE(0.5));

            
        }

    }
}
