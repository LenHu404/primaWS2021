# PRIMA Lennard Hurst
Repository for the module "Prototyping interactive media-applications and games" at Furtwangen University

## Abgabe: Forest Run
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

### Checklist for the final assignment
| Nr | Criterion         | Explanation                                                                                                         |
|---:|-------------------|---------------------------------------------------------------------------------------------------------------------|
|  0 | Units and Positions | The 0 is at the start of the path, with the Obstacles moving in -Z direction it seems like the runner is moving on the path.                                  |
|  1 | Hierarchy         | All mivng things, that lay on the path are children of the node "Band". This node is moving in -Z direction and so are the children. The Runner is just a child of the rrot node and has the parts of his body as children. For a Schematic of the Hierarchy click <a href="https://lenhu404.github.io/primaWS2021/projects/ForestRun/Textures/hierarchy.png">here</a>.   |
|  2 | Editor            | Each obstacle, the enviroment and the runner were created in the Editor.            |
|  3 | Scriptcomponents  | Scriptcomponets were escpecially used for the Runner and Goldcoins.      |
|  4 | Extend            | Derive classes from FudgeCore and explain if that was useful in your context or not and why.                        |
|  5 | Sound             | Sounds were used for indicating damage and for collecting Goldcoins. There is also the option to have music in the background.   |
|  6 | VUI               | There is an UI for displaying Health, the current score and the Highscore     |
|  7 | Event-System      | the Event-System is used for the collision between runner and Obstacles. |
|  8 | External Data     | Create a configuration file your application loads and adjusts to the content. Explain your choice of parameters.   |
|  9 | Light             | There are two sources of light in the Scene. One ambient and one Directional. This way you can see the forms of the 3D-Objects. |
|  A | Physics           | The Physics are used for the Collision handling.               |
|  B | Net               | --                                                                      |
|  C | State Machines    | Create autonomous entities using the StateMachine (1) and/or ComponentStateMachine (1) defined in FudgeAid          |
|  D | Animation         | Animate using the animation system of FudgeCore (1) and/or Sprites (1) as defined in FudgeAid                           |