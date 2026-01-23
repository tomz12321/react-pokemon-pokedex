export const Welcome = () => {
  return (
    <div className='welcome'>
      <h2 className='welcome-title'>NEURAL POKÉDEX INTERFACE</h2>
      <p className='welcome-text'>
        Initialize query protocol by entering Pokemon designation
      </p>
      <p
        className='welcome-text'
        style={{ fontSize: '1rem', marginTop: '30px' }}
      >
        System Status:{' '}
        <span style={{ color: 'var(--neon-green)' }}>● ONLINE</span>
      </p>
      <p
        style={{
          fontSize: '0.8rem',
          color: 'var(--border)',
          marginTop: '40px',
          fontFamily: 'Orbitron, sans-serif',
          letterSpacing: '2px'
        }}
      >
        DATABASE CONNECTION ESTABLISHED
      </p>
    </div>
  );
};
