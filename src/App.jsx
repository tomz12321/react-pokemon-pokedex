import { useState, useEffect } from 'react';
import './App.css';
import { Welcome } from './components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPokemon,
  selectStatus,
  selectCurrentName,
  clearError
} from './reducers/pokemon';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PokemonNotFound } from './components/PokemonNotFound';
import { Pokemon } from './components/Pokemon';

function App() {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector(selectStatus);
  const currentName = useSelector(selectCurrentName);
  const isLoading = status === 'loading';

  // 成功抓取後導頁
  useEffect(() => {
    if (status === 'succeeded' && currentName) {
      navigate(`/pokemon/${currentName}`);
    }
  }, [status, currentName, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    // 輸入驗證：阻擋空提交
    if (!trimmedName) {
      return;
    }

    // 清除之前的錯誤狀態
    dispatch(clearError());
    // 發送抓取請求
    dispatch(fetchPokemon(trimmedName));
  };

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
            <form onSubmit={handleSubmit}>
              <input
                onChange={(e) => setName(e.currentTarget.value)}
                placeholder='Enter Pokemon designation...'
                value={name}
                disabled={isLoading}
              />
              <button
                type='submit'
                disabled={isLoading || !name.trim()}
                style={{
                  opacity: isLoading || !name.trim() ? 0.6 : 1,
                  cursor: isLoading || !name.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'SCANNING...' : 'SCAN'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
