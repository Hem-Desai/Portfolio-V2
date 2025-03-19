import Matter from "matter-js";

export class PhysicsSimulation {
  private engine: Matter.Engine;
  private world: Matter.World;
  private elements: Map<Matter.Body, HTMLElement>;
  private bounds: Matter.Body[];
  private isRunning: boolean;
  private animationFrame: number | null;

  constructor() {
    // Create engine with more iterations for stability
    this.engine = Matter.Engine.create({
      enableSleeping: false,
      constraintIterations: 4,
    });

    // Increase gravity for more dramatic effect
    this.engine.gravity.y = 1;
    this.world = this.engine.world;
    this.elements = new Map();
    this.bounds = [];
    this.isRunning = false;
    this.animationFrame = null;

    // Create bounds with some padding
    const padding = 100;
    const ground = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + padding,
      window.innerWidth * 2,
      padding * 2,
      {
        isStatic: true,
        restitution: 0.5,
        friction: 0.1,
      }
    );

    const leftWall = Matter.Bodies.rectangle(
      -padding,
      window.innerHeight / 2,
      padding * 2,
      window.innerHeight * 2,
      {
        isStatic: true,
        restitution: 0.5,
        friction: 0.1,
      }
    );

    const rightWall = Matter.Bodies.rectangle(
      window.innerWidth + padding,
      window.innerHeight / 2,
      padding * 2,
      window.innerHeight * 2,
      {
        isStatic: true,
        restitution: 0.5,
        friction: 0.1,
      }
    );

    this.bounds = [ground, leftWall, rightWall];
    Matter.World.add(this.world, this.bounds);

    console.log("Physics world created with bounds");
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log("Starting physics simulation");
    this.animate();
  }

  public stop() {
    console.log("Stopping physics simulation");
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.reset();
  }

  private reset() {
    console.log("Resetting physics world");
    Matter.World.clear(this.world, false);
    Matter.World.add(this.world, this.bounds);
    this.elements.clear();
  }

  public addElement(element: HTMLElement) {
    const bounds = element.getBoundingClientRect();

    // Create a body with more dramatic physics properties
    const body = Matter.Bodies.rectangle(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
      bounds.width,
      bounds.height,
      {
        restitution: 0.7, // More bounce
        friction: 0.1,
        density: 0.001,
        frictionAir: 0.001,
        chamfer: { radius: 5 }, // Rounded corners
      }
    );

    console.log("Adding element to physics world:", {
      x: body.position.x,
      y: body.position.y,
      width: bounds.width,
      height: bounds.height,
    });

    Matter.World.add(this.world, body);
    this.elements.set(body, element);
    return body;
  }

  private animate = () => {
    if (!this.isRunning) return;

    Matter.Engine.update(this.engine, 1000 / 60);

    this.elements.forEach((element, body) => {
      if (element && element.style) {
        // Apply transform with slight easing
        const transform = `translate(${
          body.position.x - element.offsetWidth / 2
        }px, ${body.position.y - element.offsetHeight / 2}px) rotate(${
          body.angle
        }rad)`;

        element.style.transform = transform;
      }
    });

    this.animationFrame = requestAnimationFrame(this.animate);
  };

  public addRandomForces() {
    console.log("Adding random forces to elements");
    this.elements.forEach((_, body) => {
      // More dramatic random forces
      const force = {
        x: (Math.random() - 0.5) * 0.05,
        y: -Math.random() * 0.15, // Stronger upward force
      };

      // Apply the force and add some spin
      Matter.Body.applyForce(body, body.position, force);
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
    });
  }
}
