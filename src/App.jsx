import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Routes, Route, useMatch, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchPokemon, normalizePokemonName, selectPokemonByName, selectRequestByName } from './reducers/pokemon';
import { Welcome } from './components/Welcome';
import { PokemonNotFound } from './components/PokemonNotFound';
import { Pokemon } from './components/Pokemon';
import { Icon } from './components/Icon';
import { version } from '../package.json';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const match = useMatch('/pokemon/:pokemonName');
  const legacyError = useMatch('/not-found');
  const [searchParams] = useSearchParams();
  const routeName = normalizePokemonName(match?.params.pokemonName ||
    (legacyError ? searchParams.get('name') || '' : ''));
  const pokemon = useSelector(selectPokemonByName(routeName));
  const request = useSelector(selectRequestByName(routeName));
  const isLoading = Boolean(match) && !pokemon && request.status === 'loading';
  const isNotFound = Boolean(match) && !pokemon && request.error?.kind === 'not-found';

  useEffect(() => {
    setName(routeName);
  }, [routeName]);

  useEffect(() => {
    document.title = pokemon && match ? `${pokemon.name} · Pokédex` : 'Pokédex — Discover Pokémon';
  }, [pokemon, match?.pathname]);

  const search = (value) => {
    const query = normalizePokemonName(value);
    if (!query || isLoading) return;
    setName(query);
    if (match && query === routeName) {
      dispatch(fetchPokemon(query));
    } else {
      navigate(`/pokemon/${encodeURIComponent(query)}`);
    }
  };

  const editSearch = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <div className='app-shell'>
      <a className='skip-link' href='#main-content'>Skip to content</a>
      <header className='app-header'>
        <Link className='brand' to='/' aria-label='Pokédex home'>
          <span className='pokeball-mark' aria-hidden='true' />
          <span>POKÉDEX<span className='brand-caption'>The Pokémon field guide</span></span>
        </Link>
        <span className='edition-label'>EXPLORE & DISCOVER</span>
      </header>

      <main className='pokedex' id='main-content' tabIndex='-1'>
        <section className='search-section' aria-labelledby='search-heading'>
          <p className='eyebrow'>A LITTLE CURIOSITY GOES A LONG WAY</p>
          <h1 id='search-heading'>Find your next <span>discovery.</span></h1>
          <p className='search-intro'>Get to know the Pokémon that make this world extraordinary.</p>
          <form className='search-form' role='search' onSubmit={(event) => {
            event.preventDefault();
            search(name);
          }}>
            <label htmlFor='pokemon-search'>Search Pokémon</label>
            <div className='search-controls'>
              <div className='search-input-wrap'>
                <Icon name='search' />
                <input ref={inputRef} id='pokemon-search' name='pokemon' type='search'
                  value={name} onChange={(event) => setName(event.currentTarget.value)}
                  placeholder='e.g. pikachu or 25' autoComplete='off' autoCapitalize='none'
                  spellCheck='false' enterKeyHint='search' disabled={isLoading}
                  aria-describedby='search-hint search-status'
                  aria-invalid={isNotFound && normalizePokemonName(name) === routeName || undefined} />
              </div>
              <button className='button button-primary search-button' type='submit'
                disabled={isLoading || !name.trim()}>
                {isLoading ? 'Searching…' : 'Search'}
                {isLoading ? <span className='spinner' aria-hidden='true' /> : <Icon name='arrow' />}
              </button>
            </div>
            <p id='search-hint' className='search-hint'>Use an English name or a Pokédex number.</p>
          </form>
          <p id='search-status' className='search-status' role='status' aria-live='polite' aria-atomic='true'>
            {isLoading ? `Searching for ${routeName}…` : pokemon && match ?
              `Found ${pokemon.name}. Explore the details below.` : ''}
          </p>
        </section>

        <div className='results-region' aria-busy={isLoading}>
          <Routes>
            <Route path='/pokemon/:pokemonName' element={<Pokemon onEditSearch={editSearch} />} />
            <Route path='/not-found' element={<PokemonNotFound onEditSearch={editSearch} />} />
            <Route path='*' element={<Welcome onSearch={search} />} />
          </Routes>
        </div>
      </main>

      <footer className='app-footer'>
        <span>A world worth exploring.</span>
        <span>Data & artwork from <a href='https://pokeapi.co/'>PokéAPI</a><span className='footer-divider'>/</span>v{version}</span>
      </footer>
    </div>
  );
}

export default App;
