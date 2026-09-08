import { useState } from 'react';

export const PokemonArtwork = ({ name, artwork, sprite, decorative = false }) => {
  const [failedSources, setFailedSources] = useState([]);
  const source = [artwork, sprite].find((url) => url && !failedSources.includes(url));

  return source ? (
    <img className='pokemon-image' src={source} alt={decorative ? '' : name}
      width='240' height='240'
      onError={() => setFailedSources((previous) => [...previous, source])} />
  ) : (
    <span className='pokemon-image-placeholder' aria-hidden={decorative || undefined}>
      <span className='pokeball-mark' aria-hidden='true' />
      <span>Image unavailable</span>
    </span>
  );
};
