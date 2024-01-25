import {
  ActionManager, Axis,
  ExecuteCodeAction,
  FollowCamera,
  MeshBuilder, PhysicsAggregate, PhysicsImpostor, PhysicsShapeType,
  Scene, Space,
  Vector3
} from "@babylonjs/core";
import {Mesh} from "@babylonjs/core/Meshes/mesh";

export class Player {
  private player: Mesh;
  private velocity = Vector3.Zero();
  private controls = {
    inAir: true
  };
  private prevTime = performance.now();
  private moveSpeed = 2;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly scene: Scene
  ) {
    let camera = new FollowCamera("FollowCam", new Vector3(0, 5,0), scene);
    camera.radius = 45;
    camera.heightOffset = 5;
    camera.rotationOffset = 0;
    camera.maxCameraSpeed = 10
    camera.attachControl();

    this.scene.actionManager = new ActionManager(scene);
    this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger,  (evt) => {
      this.controls[evt.sourceEvent.keyCode] = evt.sourceEvent.type === "keydown";
    }));

    this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger,  (evt) => {
      this.controls[evt.sourceEvent.keyCode] = evt.sourceEvent.type === "keydown";
    }));

    this.player = MeshBuilder.CreateBox("sphere1", {width: 1, height: 1, depth: 1}, scene);
    this.player.position.y = -2;
    this.player.position.z = 4
    // this.player.ellipsoid = new Vector3(1, 2, 1);
    // this.player.ellipsoidOffset = new Vector3(2, 2, 0);
    // this.player.onCollideObservable.add(() => {
    //   this.controls.inAir = false;
    //   this.velocity.y = 0;
    // });

    camera.lockedTarget = this.player;

    this.player.physicsImpostor = new PhysicsImpostor(this.player, PhysicsImpostor.SphereImpostor, {mass: 1});

    this.scene.onBeforeRenderObservable.add(()=> {
      this.move();
    });
  }

  move() {
    if (this.player) {

      let time = performance.now();
      // Create a delta value based on current time
      let delta = ( time - this.prevTime ) / 1000;

      this.velocity.y = 0;

      let rotation = Vector3.Zero();
      if (this.player.rotationQuaternion) {
        rotation = this.player.rotationQuaternion.toEulerAngles();
      }

      if (this.controls["87"]) {
        this.player.position.x += -Math.sin(rotation.y) / -this.moveSpeed;
      } else {
      }
      if (this.controls["83"]) {
        this.player.position.x -= -Math.sin(rotation.y) / -this.moveSpeed;
      } else {
      }
      if (this.controls["68"]) {
        this.player.rotate(Axis.Y, 0.03, Space.WORLD);
      }
      if (this.controls["65"]) {
        this.player.rotate(Axis.Y, -0.03, Space.WORLD)
      }

      if (!this.controls.inAir) {
        if (this.controls["32"]) {
          console.log('should jump...')
          // this.velocity.y = 50 * delta
          this.controls.inAir = true
        }
      }

      this.player.moveWithCollisions(this.velocity)
      this.prevTime = time;
    }
  };
}