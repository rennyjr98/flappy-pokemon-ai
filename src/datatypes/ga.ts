import { pokemons, TOTAL_POKEMON } from "../sketch/Sketch";
import p5Types from "p5";
import { Pokemon } from "./Pokemon";

export const nextGeneration = (savedPokemons: Pokemon[], p5: p5Types) => {
  calculateFitness(savedPokemons);
  for (let i = 0; i < TOTAL_POKEMON; i++) {
    pokemons[i] = pickOne(savedPokemons, p5);
  }
  savedPokemons = [];
};

export const pickOne = (savedPokemons: Pokemon[], p5: p5Types) => {
  let index = 0;
  let r = p5.random(1);
  while (r > 0) {
    r = r - savedPokemons[index].fitness;
    index++;
  }
  index--;
  let pokemon = savedPokemons[index];
  let child = new Pokemon(p5, pokemon.brain);
  child.mutate();
  return child;
};

export const calculateFitness = (savedPokemons: Pokemon[]) => {
  let sum = 0;
  for (let pokemon of savedPokemons) {
    sum += pokemon.score;
  }
  for (let pokemon of savedPokemons) {
    pokemon.fitness = pokemon.score / sum;
  }
};
