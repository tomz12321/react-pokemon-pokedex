import { useSearchParams } from 'react-router-dom';
import { Icon } from './Icon';

const messages = {
  'not-found': { title: 'No Pokémon found', description: 'Check the English spelling, or try a Pokédex number such as 25.' },
  network: { title: 'We couldn’t connect', description: 'Check your internet connection, then try your search again.' },
  server: { title: 'The Pokédex is taking a break', description: 'The data service is temporarily unavailable. Please try again in a moment.' },
  timeout: { title: 'That took a little too long', description: 'The connection timed out. Your search is saved — give it another try.' }
};

export const PokemonNotFound = ({ name, error, onRetry, onEditSearch }) => {
  const [searchParams] = useSearchParams();
  const query = name || searchParams.get('name');
  const kind = error?.kind || 'not-found';
  const message = messages[kind] || messages.network;

  return (
    <section className='empty-state error-state' aria-labelledby='error-heading'>
      <div className='state-symbol' aria-hidden='true'><Icon name={kind === 'not-found' ? 'search' : 'warning'} /></div>
      <div role='alert' aria-atomic='true'>
        <p className='eyebrow'>LET’S TRY THAT AGAIN</p>
        <h2 id='error-heading'>{message.title}</h2>
        {query && <p className='error-query'>Search: <strong>“{query}”</strong></p>}
        <p className='state-description'>{message.description}</p>
      </div>
      <div className='state-actions'>
        {kind !== 'not-found' && onRetry && (
          <button className='button button-primary' type='button' onClick={onRetry}>
            <Icon name='retry' />Try again
          </button>
        )}
        <button className={`button ${kind === 'not-found' ? 'button-primary' : 'button-secondary'}`}
          type='button' onClick={onEditSearch}>Edit search<Icon name='arrow' /></button>
      </div>
    </section>
  );
};
