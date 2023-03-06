import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { Pokemon } from "../datatypes/Pokemon";
import { Pipe } from "../datatypes/Pipes";
import { nextGeneration } from "../datatypes/ga";

import pikachuImgPlayer from "../assets/pikachu.png";
import charmanderImgPlayer from "../assets/charmander.png";
import bulbasaurImgPlayer from "../assets/bullbasaur.png";
import squirtleImgPlayer from "../assets/squirtle.png";

export const TOTAL_POKEMON = 500;
export let pikachuImg: p5Types.Image;
export let charmanderImg: p5Types.Image;
export let bullbasaurImg: p5Types.Image;
export let squirtleImg: p5Types.Image;
export let pokemons: Pokemon[] = [];
export let savedPokemons: Pokemon[] = [];
let pipes: Pipe[] = [];
let counter = 0;
let slider: p5Types.Element;
let pokemonIndex: number = 0;

interface SketchProps {
  selectedPokemon: number;
}

export const getPokemonImg = () => {
  switch (pokemonIndex) {
    case 0:
      return pikachuImg;
    case 1:
      return charmanderImg;
    case 2:
      return bullbasaurImg;
    case 3:
      return squirtleImg;
    default:
      return pikachuImg;
  }
};

const SketchComponent: React.FunctionComponent<SketchProps> = (
  props: SketchProps
) => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(1200, 480).parent(canvasParentRef);
    pikachuImg = p5.loadImage(pikachuImgPlayer);
    charmanderImg = p5.loadImage(charmanderImgPlayer);
    bullbasaurImg = p5.loadImage(bulbasaurImgPlayer);
    squirtleImg = p5.loadImage(squirtleImgPlayer);
    slider = p5.createSlider(1, 10, 1);
    for (let i = 0; i < TOTAL_POKEMON; i++) {
      pokemons[i] = new Pokemon(p5);
    }
  };

  const draw = (p5: p5Types) => {
    pokemonIndex = props.selectedPokemon;
    for (let n = 0; n < slider.value(); n++) {
      if (counter % 75 == 0) {
        pipes.push(new Pipe(p5));
      }
      counter++;

      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        for (let j = pokemons.length - 1; j >= 0; j--) {
          if (pipes[i].hits(p5, pokemons[j])) {
            savedPokemons.push(pokemons.splice(j, 1)[0]);
          }
        }
        if (pipes[i].offscreen()) {
          pipes.splice(i, 1);
        }
      }

      for (let i = pokemons.length - 1; i >= 0; i--) {
        if (pokemons[i].offscreen(p5)) {
          savedPokemons.push(pokemons.splice(i, 1)[0]);
        }
      }

      for (let pokemon of pokemons) {
        pokemon.think(p5, pipes);
        pokemon.update();
      }

      if (pokemons.length === 0) {
        counter = 0;
        nextGeneration(savedPokemons, p5);
        pipes = [];
      }
    }

    p5.background(30);
    for (let pokemon of pokemons) {
      pokemon.show(p5, getPokemonImg());
    }
    for (let pipe of pipes) {
      pipe.show(p5);
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default SketchComponent;
