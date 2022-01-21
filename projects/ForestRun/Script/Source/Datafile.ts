namespace Script {
    import ƒ = FudgeCore;
    import fs from 'fs';
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class Datafile {

        public hsore: number;
        constructor() {
            this.getData();

        }

        public save(): void {
            let data = {
                "hscore": GameState.get().hScore
            }

            let jdata: string = JSON.stringify(data);


            fs.writeFile('data.json', jdata, (err: Error) => {
                if (err) {
                    throw err;
                }
                console.log("JSON data is saved.");
            });
        }

        public getData(): void {
            fs.readFile('data.json', 'utf-8', (err: Error, data: string) => {
                if (err) {
                    throw err;
                }

                GameState.get().hScore = JSON.parse(data.toString());

            });


        }
    }
}