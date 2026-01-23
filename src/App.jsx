import { useState } from 'react';
import './App.css';
import { Welcome } from './components/Welcome';
import { useDispatch } from 'react-redux';
import { loadPokemon } from './reducers/pokemon';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PokemonNotFound } from './components/PokemonNotFound';
import { Pokemon } from './components/Pokemon';

function App() {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      {/* HUD Corner Elements */}
      <div className='hud-corner top-left'></div>
      <div className='hud-corner top-right'></div>
      <div className='hud-corner bottom-left'></div>
      <div className='hud-corner bottom-right'></div>

      <div className='center'>
        <div className='pokedex'>
          {/* Header */}
          <div className='pokedex-header'>
            <h1 className='pokedex-title'>POKÉDEX</h1>
            <p className='pokedex-subtitle'>Neural Interface v3.0</p>
          </div>

          {/* Routes */}
          <Routes>
            <Route path='/not-found' element={<PokemonNotFound />} />
            <Route path='/pokemon/:pokemonName' element={<Pokemon />} />
            <Route path='*' element={<Welcome />} />
          </Routes>

          {/* Search Form */}
          <div className='center'>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) {
                  dispatch(loadPokemon(name.trim().toLowerCase(), navigate));
                }
              }}
            >
              <input
                onChange={(e) => setName(e.currentTarget.value)}
                placeholder='Enter Pokemon designation...'
                value={name}
              />
              <button type='submit'>SCAN</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
