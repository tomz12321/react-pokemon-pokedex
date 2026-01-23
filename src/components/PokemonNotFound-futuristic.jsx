export const PokemonNotFound = () => {
  return (
    <div className='not-found'>
      <h1 className='not-found-title'>ERROR 404</h1>
      <p className='not-found-message'>
        Neural scan failed - Pokemon not found in database
      </p>
      <p
        style={{
          color: 'var(--secondary)',
          marginTop: '20px',
          fontSize: '0.9rem'
        }}
      >
        Please verify designation and retry scan protocol
      </p>
      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid var(--cta)',
          borderRadius: '8px',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '0.85rem',
          letterSpacing: '1px'
        }}
      >
        ⚠ SYSTEM ALERT: DESIGNATION INVALID
      </div>
    </div>
  );
};
