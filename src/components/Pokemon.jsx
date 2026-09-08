import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchPokemon, normalizePokemonName, selectPokemonByName, selectRequestByName } from '../reducers/pokemon';
import { PokemonArtwork } from './PokemonArtwork';
import { PokemonNotFound } from './PokemonNotFound';

const statLabels = {
  hp: 'HP', attack: 'Attack', defense: 'Defense',
  'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', speed: 'Speed'
};
const readableName = (name) => name.replaceAll('-', ' ');

export const Pokemon = ({ onEditSearch }) => {
  const { pokemonName } = useParams();
  const name = normalizePokemonName(pokemonName);
  const dispatch = useDispatch();
  const pokemon = useSelector(selectPokemonByName(name));
  const request = useSelector(selectRequestByName(name));

  // 路由決定查詢對象；狀態更新不會觸發額外導頁或失敗重試。
  useEffect(() => {
    dispatch(fetchPokemon(name));
  }, [name, dispatch]);

  if (!name || !pokemon && request.status === 'failed') {
    return <PokemonNotFound name={name} error={request.error}
      onRetry={() => dispatch(fetchPokemon(name))} onEditSearch={onEditSearch} />;
  }

  if (!pokemon) {
    return (
      <div className='loading-state' aria-hidden='true'>
        <div className='skeleton skeleton-title' />
        <div className='skeleton-layout'>
          <div className='skeleton skeleton-artwork' />
          <div className='skeleton-stat-list'>{Array.from({ length: 6 }, (_, index) => <div className='skeleton skeleton-stat' key={index} />)}</div>
        </div>
      </div>
    );
  }

  const stats = pokemon.stats || [];
  const statScale = Math.max(100, ...stats.map((stat) => stat.base_stat));
  const primaryType = pokemon.types?.[0]?.type.name || 'normal';

  return (
    <article className={`pokemon-card type-${primaryType}`} aria-labelledby='pokemon-heading'>
      <header className='pokemon-header'>
        <div>
          <p className='eyebrow'>POKÉDEX ENTRY <span className='pokemon-number'>#{String(pokemon.id).padStart(3, '0')}</span></p>
          <h2 id='pokemon-heading' className='pokemon-name'>{readableName(pokemon.name)}</h2>
        </div>
        <Link className='text-link' to='/'>Back to explore</Link>
      </header>

      <div className='pokemon-layout'>
        <div className='pokemon-profile'>
          <div className='artwork-stage'>
            <PokemonArtwork key={pokemon.id} name={readableName(pokemon.name)}
              artwork={pokemon.sprites?.other?.['official-artwork']?.front_default}
              sprite={pokemon.sprites?.front_default} />
          </div>
          <ul className='type-list' aria-label='Pokémon types'>
            {pokemon.types?.map(({ type }) => <li className={`type-badge type-${type.name}`} key={type.name}><span aria-hidden='true' />{type.name}</li>)}
          </ul>
          <dl className='pokemon-facts'>
            <div><dt>Height</dt><dd>{pokemon.height / 10}<span> m</span></dd></div>
            <div><dt>Weight</dt><dd>{pokemon.weight / 10}<span> kg</span></dd></div>
          </dl>
        </div>

        <div className='pokemon-details'>
          <section aria-labelledby='stats-heading'>
            <div className='stats-heading'><h3 id='stats-heading'>Base stats</h3><span>Scale 0–{statScale}</span></div>
            <dl className='pokemon-stats'>
              {stats.map(({ stat, base_stat }) => (
                <div className='stat-row' key={stat.name}>
                  <dt><abbr title={readableName(stat.name)}>{statLabels[stat.name] || readableName(stat.name)}</abbr></dt>
                  <dd><span className='stat-value'>{base_stat}</span><span className='stat-track' aria-hidden='true'><span style={{ width: `${base_stat / statScale * 100}%` }} /></span></dd>
                </div>
              ))}
            </dl>
          </section>
          <section className='abilities-section' aria-labelledby='abilities-heading'>
            <h3 id='abilities-heading'>Abilities</h3>
            <ul className='ability-list'>{pokemon.abilities?.map(({ ability, is_hidden }) => (
              <li key={ability.name}>{readableName(ability.name)}{is_hidden && <span>Hidden</span>}</li>
            ))}</ul>
          </section>
        </div>
      </div>
    </article>
  );
};
