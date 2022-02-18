# PRIMA Lennard Hurst
Repository for the module "Prototyping interactive media-applications and games" at Furtwangen University

## Abgabe: Forest Run
Play it on Github-Pages: <a href="https://lenhu404.github.io/primaWS2021/projects/ForestRun/index.html" target="_blank"> Lets run! </a>

Link to the code: <a href="https://github.com/LenHu404/primaWS2021/tree/main/projects/ForestRun/Script/Source" target="_blank"> Lets see! </a>

Link to old design document: <a href="https://1drv.ms/w/s!Apkox7XXqmWhhNJ-6gFDYS_fZ34s_A?e=nuOxXg" target="_blank"> here </a> 

### Controlls

You can use either W,A,S,D or the arrow keys to move. Press SPACE to jump.
Try to avoid the trees and stones. You get extra points by collecting the coins.
By pressing M you can mute the background music.


<!-- ### Format 
- Include the runtime files of FUDGE used in your repository so they don't outdate.
- Bundle the design documentation in a single well formatted PDF-file.
- Create a README.md file in your PRIMA-Repository on Github including the following
  * Title: Forest Run
  * Author: Lennard Hurst
  * Year and season Wintersemester 2021/22
  * Curriculum and semester Medieninformatik bachelor 5
  * Course this development was created in (PRIMA) 
  * Docent
  - Link to the finished and executable application on Github-Pages
  - Link to the source code
  - Link to the design document
  - Description for users on how to interact
  - Description on how to install, if applicable (additional services, database etc.) 
  - A copy of the catalogue of criteria above, the right column replaced with very brief explanations and descriptions of the fullfullments of these criteria -->

### Information
|  |          |                                                                                                                           |
|---:|-------------------|---------------------------------------------------------------------------------------------------------------------|
|    | Title             | Forest Run                                                                                                          |
|    | Author            | Lennard Hurst                                                                                                       |
|    | Year and season   | Wintersemester 2021/22                                                                                              |
|    | Curriculum and semester | Medieninformatik Bachelor 5                                                                                   |
|    | Course            | "Prototyping Interactive Media-Applications and Games" at Furtwangen University                                     |
|    | Docent            | Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl                                                                           |
|  |          |    

### Installing
You can either just play the Game online on Github-pages or download the repository and start the game on a Live-Server. 

### Checklist for the final assignment
| Nr | Criterion         | Explanation                                                                                                         |
|---:|-------------------|---------------------------------------------------------------------------------------------------------------------|
|  0 | Units and Positions | The 0 is at the start of the path, with the Obstacles moving in -Z direction it seems like the runner is moving on the path.                                  |
|  1 | Hierarchy         | All mivng things, that lay on the path are children of the node "Band". This node is moving in -Z direction and so are the children. The Runner is just a child of the rrot node and has the parts of his body as children. For a Schematic of the Hierarchy click <a href="https://lenhu404.github.io/primaWS2021/projects/ForestRun/Texture/hierarchy.png">here</a>.   |
|  2 | Editor            | Each obstacle, the enviroment and the runner were created in the Editor.            |
|  3 | Scriptcomponents  | Scriptcomponets were escpecially used for the Runner and Goldcoins.      |
|  4 | Extend            | The Costumcomponets script were extended and were extremly helpful for building the game.                        |
|  5 | Sound             | Sounds were used for indicating damage and for collecting Goldcoins. There is also the option to have music in the background.   |
|  6 | VUI               | There is an UI for displaying Health, the current score and the Highscore     |
|  7 | Event-System      | the Event-System is used for the collision between runner and Obstacles. |
|  8 | External Data     | The Game laods a json-File which holds the speed at the start of the game and and a highscore for you to beat.  |
|  9 | Light             | There are two sources of light in the Scene. One ambient and one Directional. This way you can see the forms of the 3D-Objects. |
|  A | Physics           | The Physics are used for the collision handling.                 |
|  B | Net               | --                                                               |
|  C | State Machines    | The ghost uses a statemachine to handle its behaviour.           |
|  D | Animation         | The Face of the ghost is using a sprite for the animation.       |


