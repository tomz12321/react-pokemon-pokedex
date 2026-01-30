import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearError } from '../reducers/pokemon';

export const PokemonNotFound = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 從 search params 取得失敗的 Pokemon 名稱
  const failedName = searchParams.get('name') || 'Unknown';

  const handleRetry = () => {
    dispatch(clearError());
    navigate('/');
  };

  return (
    <div
      className='not-found-container'
      style={{ textAlign: 'center', padding: '20px' }}
    >
      <div
        style={{
          fontSize: '4rem',
          marginBottom: '20px',
          filter: 'grayscale(1)',
          opacity: 0.5
        }}
      >
        ❓
      </div>
      <h1
        style={{
          color: 'var(--error, #ff6b6b)',
          fontSize: '1.5rem',
          marginBottom: '10px'
        }}
      >
        POKEMON NOT FOUND
      </h1>
      <h2
        style={{
          color: 'var(--neon-cyan, #00ffff)',
          textTransform: 'uppercase',
          fontSize: '2rem',
          marginBottom: '20px',
          wordBreak: 'break-word'
        }}
      >
        "{failedName}"
      </h2>
      <p
        style={{
          color: 'var(--secondary, #888)',
          marginBottom: '30px'
        }}
      >
        The specified Pokemon could not be found in the database.
      </p>
      <button
        onClick={handleRetry}
        style={{
          padding: '12px 30px',
          fontSize: '1rem',
          cursor: 'pointer',
          background:
            'linear-gradient(135deg, var(--primary, #1a1a2e), var(--secondary, #16213e))',
          border: '1px solid var(--neon-cyan, #00ffff)',
          color: 'var(--neon-cyan, #00ffff)',
          borderRadius: '8px',
          transition: 'all 0.3s ease'
        }}
      >
        TRY AGAIN
      </button>
    </div>
  );
};
