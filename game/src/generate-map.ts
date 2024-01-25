import {
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType,
  Scene,
  StandardMaterial,
  Vector3,
  PhysicsImpostor
} from "@babylonjs/core";


export class GenerateMap {
  constructor(
    private readonly scene: Scene
  ) {
    this.load();
  }

  load() {
    const ground = MeshBuilder.CreateGroundFromHeightMap("ground", "heightmap.png", {
      width: 200,
      height: 200,
      subdivisions: 200,
      minHeight: 0,
      maxHeight: 5,
      onReady: (grnd) => {
        grnd.position = new Vector3(0, -20, 0);
        grnd.material = groundMaterial;
        grnd.physicsImpostor = new PhysicsImpostor(grnd, PhysicsImpostor.HeightmapImpostor, {mass: 0}, this.scene);
      }
    }, this.scene);

    const groundMaterial = new StandardMaterial("groundMaterial", this.scene);
    ground.material = groundMaterial;

    // ground.checkCollisions = true;

    // const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, this.scene);
  }
}