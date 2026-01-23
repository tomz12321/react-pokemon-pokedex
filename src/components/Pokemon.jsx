import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadPokemon } from '../reducers/pokemon';
import { useNavigate } from 'react-router-dom';

export const Pokemon = () => {
  const { pokemonName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pokemon = useSelector((state) => state.pokemon.pokemon);

  useEffect(() => {
    if (pokemonName && pokemonName !== pokemon?.name) {
      dispatch(loadPokemon(pokemonName, navigate));
    }
  }, [pokemonName, dispatch, navigate, pokemon?.name]);

  if (!pokemon) {
    return (
      <div className='loading'>
        <div className='loading-spinner'></div>
        <p className='loading-text'>SCANNING DATABASE...</p>
      </div>
    );
  }

  return (
    <div className='pokemon-card'>
      <h2 className='pokemon-name'>
        {pokemon.name}
        <span
          style={{
            fontSize: '1.2rem',
            marginLeft: '15px',
            color: 'var(--secondary)',
            fontWeight: 400
          }}
        >
          #{String(pokemon.id).padStart(3, '0')}
        </span>
      </h2>

      {pokemon.sprites?.front_default && (
        <img
          className='pokemon-image'
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
        />
      )}

      {pokemon.types && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '20px',
            marginBottom: '20px'
          }}
        >
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              style={{
                background:
                  'linear-gradient(135deg, var(--primary), var(--secondary))',
                padding: '8px 20px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '1px',
                border: '1px solid var(--neon-cyan)',
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
              }}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      )}

      {pokemon.stats && (
        <div className='pokemon-stats'>
          {pokemon.stats.map((stat) => (
            <div key={stat.stat.name} className='stat-item'>
              <div className='stat-label'>
                {stat.stat.name.replace('-', ' ')}
              </div>
              <div className='stat-value'>{stat.base_stat}</div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          background: 'rgba(0, 255, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          fontSize: '0.9rem'
        }}
      >
        <div>
          <span style={{ color: 'var(--secondary)' }}>Height:</span>{' '}
          <span style={{ color: 'var(--neon-cyan)' }}>
            {pokemon.height / 10}m
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--secondary)' }}>Weight:</span>{' '}
          <span style={{ color: 'var(--neon-cyan)' }}>
            {pokemon.weight / 10}kg
          </span>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <span style={{ color: 'var(--secondary)' }}>Abilities:</span>{' '}
          <span
            style={{ color: 'var(--neon-cyan)', textTransform: 'capitalize' }}
          >
            {pokemon.abilities?.map((a) => a.ability.name).join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
};
