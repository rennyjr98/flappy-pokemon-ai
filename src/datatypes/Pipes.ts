import p5Types from "p5";
import { Pokemon } from "./Pokemon";

export class Pipe {
  public spacing: number;
  public top: number;
  public bottom: number;
  public x: number;
  public w: number;
  public speed: number;

  constructor(p5: p5Types) {
    this.spacing = 125;
    this.top = p5.random(p5.height / 6, (3 / 4) * p5.height);
    this.bottom = p5.height - (this.top + this.spacing);
    this.x = p5.width;
    this.w = 80;
    this.speed = 6;
  }

  hits(p5: p5Types, pokemon: Pokemon) {
    if (pokemon.y < this.top || pokemon.y > p5.height - this.bottom) {
      if (pokemon.x > this.x && pokemon.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  show(p5: p5Types) {
    p5.fill(255);
    p5.rectMode(p5.CORNER);
    p5.rect(this.x, 0, this.w, this.top, 10);
    p5.rect(this.x, p5.height - this.bottom, this.w, this.bottom, 10);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
}
