import { PokemonArtwork } from './PokemonArtwork';
import { Icon } from './Icon';

const favorites = [
  { id: 25, name: 'pikachu', label: 'Pikachu', type: 'electric' },
  { id: 1, name: 'bulbasaur', label: 'Bulbasaur', type: 'grass' },
  { id: 4, name: 'charmander', label: 'Charmander', type: 'fire' }
];

export const Welcome = ({ onSearch }) => (
  <section className='welcome' aria-labelledby='welcome-heading'>
    <div className='section-heading'>
      <div><p className='eyebrow'>NOT SURE WHERE TO START?</p><h2 id='welcome-heading'>Meet a few favorites.</h2></div>
      <p>Pick a Pokémon. Get to know it.</p>
    </div>
    <div className='starter-grid'>
      {favorites.map((pokemon) => (
        <button className={`starter-card type-${pokemon.type}`} key={pokemon.name} type='button'
          onClick={() => onSearch(pokemon.name)} aria-label={`Explore ${pokemon.label}`}>
          <span className='starter-number'>#{String(pokemon.id).padStart(3, '0')}</span>
          <PokemonArtwork name={pokemon.label} decorative
            artwork={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            sprite={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} />
          <span className='starter-caption'><span><strong>{pokemon.label}</strong><span className='starter-type'>{pokemon.type}</span></span><Icon name='arrow' /></span>
        </button>
      ))}
    </div>
    <p className='welcome-note'>From familiar favorites to new discoveries — explore types, abilities, and base stats.</p>
  </section>
);
