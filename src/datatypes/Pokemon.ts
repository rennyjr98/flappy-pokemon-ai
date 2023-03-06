import { NeuralNetwork } from "../neuralnetwork/NeuralNetwork";
import p5Types from "p5";
import { Pipe } from "./Pipes";

export class Pokemon {
  public x: number;
  public y: number;
  public gravity: number;
  public lift: number;
  public velocity: number;
  public score: number;
  public fitness: number;
  public brain: NeuralNetwork;

  constructor(p5: p5Types, brain?: NeuralNetwork) {
    this.y = p5.height / 2;
    this.x = 64;
    this.gravity = 0.8;
    this.lift = -12;
    this.velocity = 0;
    this.score = 0;
    this.fitness = 0;

    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, 8, 2);
    }
  }

  show(p5: p5Types, img: p5Types.Image) {
    p5.image(img, this.x, this.y, 32, 32);
  }

  up() {
    this.velocity += this.lift;
  }

  mutate() {
    this.brain.mutate(0.1);
  }

  think(p5: p5Types, pipes: Pipe[]) {
    let closest: Pipe | undefined = undefined;
    let closestD: number = Infinity;

    for (let i = 0; i < pipes.length; i++) {
      let d: number = pipes[i].x + pipes[i].w - this.x;
      if (d < closestD && d > 0) {
        closest = pipes[i];
        closestD = d;
      }
    }

    if (closest == null) {
      return;
    }

    let inputs = [];
    inputs[0] = this.y / p5.height;
    inputs[1] = closest.top / p5.height;
    inputs[2] = closest.bottom / p5.height;
    inputs[3] = closest.x / p5.height;
    inputs[4] = this.velocity / 10;
    let output = this.brain.predict(inputs);
    if (output != null && output[0] > output[1]) {
      this.up();
    }
  }

  offscreen(p5: p5Types) {
    return this.y > p5.height || this.y < 0;
  }

  update() {
    this.score++;
    this.velocity += this.gravity;
    this.y += this.velocity;
  }
}
