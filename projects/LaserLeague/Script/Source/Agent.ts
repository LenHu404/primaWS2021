namespace LaserLeague {
    import ƒ = FudgeCore;

    export class Agent extends ƒ.Node {

        constructor() {

            super("Agent");
            /* this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad("MeshAgnt")));
            this.addComponent(new ƒ.ComponentMaterial(
                new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1))))
            );
            this.mtxLocal.translateZ(1); */
            //this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(ƒ.Vector3.ONE(0.5));
            //this.addComponent(new agentComponentScript());
           this.createAgent();

            
        }

        async createAgent() {
            let agentBlueprint: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-11-03T17:02:45.274Z|68116"]; 

            let startPos: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0.5);

            let agentInstance = await ƒ.Project.createGraphInstance(agentBlueprint);

            agentInstance.mtxLocal.translation = startPos;

            this.addChild(agentInstance);
        }
    }
}
