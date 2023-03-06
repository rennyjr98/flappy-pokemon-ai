import "./App.css";
import SketchComponent from "./sketch/Sketch";

import pikachuImgPlayer from "./assets/pikachu.png";
import charmanderImgPlayer from "./assets/charmander.png";
import bulbasaurImgPlayer from "./assets/bullbasaur.png";
import squirtleImgPlayer from "./assets/squirtle.png";
import { useState } from "react";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<number>(0);
  return (
    <div className="App">
      <SketchComponent selectedPokemon={selectedPokemon} />
      <div className="container">
        <h1>Flappy Pokemon</h1>
        <h4>Instructions</h4>
        <p>
          The little slider controls the velocity of the "game", you can
          increase or decrease the speed to make the AI learns faster or slower
        </p>
        <nav>
          <h5>Choose a pokemon</h5>
          <ul>
            <li>
              <button onClick={() => setSelectedPokemon(0)}>
                <img src={pikachuImgPlayer} alt="pikachu" />
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedPokemon(1)}>
                <img src={charmanderImgPlayer} alt="charmander" />
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedPokemon(2)}>
                <img src={bulbasaurImgPlayer} alt="bulbasaur" />
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedPokemon(3)}>
                <img src={squirtleImgPlayer} alt="squirtle" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default App;
