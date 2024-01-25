import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  CannonJSPlugin,
} from "@babylonjs/core";
import {GenerateMap} from "./generate-map";

//import HavokPhysics from "@babylonjs/havok";
// heightmap is not implemented in Havok for now, but its mutch faster
import * as Cannon from 'cannon-es';
import {Player} from "./player";

window.CANNON = Cannon;

class App {
  private engine: Engine;
  private scene: Scene;

  constructor() {
    this.main();
  }

  async main() {
    // create the canvas html element and attach it to the webpage
    var canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    // initialize babylon scene and engine
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);

    var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene);
    await this.scene.debugLayer.show();

    await this.addPhysics();

    new GenerateMap(this.scene);

    new Player(canvas, this.scene);

    // const sphere = MeshBuilder.CreateBox("sphere", { width: 1, height: 2, depth: 1}, this.scene);
    // sphere.position = new Vector3(0, 1, 3);
    // sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, {mass: 1});
    //
    //
    // // Move the sphere upward at 4 units
    // sphere.position.y = 4;

    // const sphereAggregate = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this.scene);

    this.loop();
  }

  async addPhysics() {
    this.scene.enablePhysics(undefined, (new CannonJSPlugin(true, 100)));
  }

  loop() {
    this.engine.runRenderLoop(() => {
      if (this.scene) {
        this.scene.render();
      }
    });
  }
}
new App();