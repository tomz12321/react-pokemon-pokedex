import React, { useState } from 'react';
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
    <div className='center'>
      <div className='pokedex'>
        <Routes>
          <Route path='/not-found' element={<PokemonNotFound />} />
          <Route path='/pokemon/:pokemonName' element={<Pokemon />} />
          <Route path='*' element={<Welcome />} />
        </Routes>

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
              placeholder='Enter a pokemon name..'
            />
            <button type='submit'>Search</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
