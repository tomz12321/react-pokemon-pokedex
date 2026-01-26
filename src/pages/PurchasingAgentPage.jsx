import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const POKEMON_OPTIONS = [
  { value: 'pikachu', label: 'Pikachu' },
  { value: 'dragonite', label: 'Dragonite' },
  { value: 'lucario', label: 'Lucario' },
  { value: 'garchomp', label: 'Garchomp' },
];

const LOCATION_OPTIONS = [
  { value: 'taipei', label: 'Pokemon Center Taipei' },
  { value: 'okinawa', label: 'Pokemon Center Okinawa' },
  { value: 'fukuoka', label: 'Pokemon Center Fukuoka' },
  { value: 'tokyo_nihonbashi', label: 'Pokemon Center Tokyo Nihonbashi' },
];

export function PurchasingAgentPage() {
  const [pokemon, setPokemon] = useState(POKEMON_OPTIONS[0].value);
  const [location, setLocation] = useState(LOCATION_OPTIONS[0].value);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Payment form refs
  const cardNumberRef = useRef(null);
  const cardExpirationRef = useRef(null);
  const cardCcvRef = useRef(null);

  const isEligibleForAgent = quantity >= 10;

  useEffect(() => {
    // Initialize TapPay
    if (window.TPDirect) {
      window.TPDirect.setupSDK(
        12348, // Sandbox App ID
        'app_key_12348', // Sandbox App Key (Using dummy key for demo as per standard practice unless provided)
        'sandbox'
      );

      window.TPDirect.card.setup({
        fields: {
          number: {
            element: cardNumberRef.current,
            placeholder: '**** **** **** ****',
          },
          expirationDate: {
            element: cardExpirationRef.current,
            placeholder: 'MM / YY',
          },
          ccv: {
            element: cardCcvRef.current,
            placeholder: 'ccv',
          },
        },
        styles: {
          input: {
            color: 'var(--text)',
            'font-size': '16px',
            'font-family': "'Exo 2', sans-serif"
          },
          ':focus': {
            'color': 'var(--neon-cyan)'
          },
          '.valid': {
            color: 'var(--neon-green)'
          },
          '.invalid': {
            color: 'var(--cta)'
          },
        },
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Get Prime
    window.TPDirect.card.getPrime((result) => {
      setLoading(false);
      if (result.status !== 0) {
        alert('Payment failed: ' + result.msg);
        return;
      }

      const prime = result.card.prime;
      console.log('TapPay Prime obtained:', prime);
      console.log('Order Details:', { pokemon, location, quantity });

      alert(`Order Placed Successfully!\nPrime: ${prime}\n${isEligibleForAgent ? 'Trainer tomz12321 will handle this order!' : 'Order received.'}`);
      navigate('/');
    });
  };

  return (
    <div className="purchasing-agent-page">
      <div className="center">
        <div className="pokedex">
          <div className="pokedex-header">
            <h1 className="pokedex-title">DAIGOU</h1>
            <p className="pokedex-subtitle">OFFICIAL PURCHASING AGENT</p>
          </div>

          <form onSubmit={handleSubmit} className="agent-form">
            <div className="form-section">
              <h3 className="section-title">Mission Parameters</h3>

              <div className="form-group">
                <label>Target Specimen</label>
                <select value={pokemon} onChange={(e) => setPokemon(e.target.value)}>
                  {POKEMON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Extraction Point</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  {LOCATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>

              {isEligibleForAgent && (
                <div className="special-agent-message">
                  <div className="agent-icon">⚠️</div>
                  <div className="agent-text">
                    <strong>SPECIAL OP ACTIVATED</strong>
                    <br />
                    Trainer <em>tomz12321</em> has been assigned to acquire your {quantity} {pokemon}s from {LOCATION_OPTIONS.find(l => l.value === location).label}.
                  </div>
                </div>
              )}
            </div>

            <div className="form-section">
              <h3 className="section-title">Credit Authorization</h3>

              <div className="form-group">
                <label>Card Number</label>
                <div ref={cardNumberRef} className="tpfield"></div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry</label>
                  <div ref={cardExpirationRef} className="tpfield"></div>
                </div>
                <div className="form-group">
                  <label>CCV</label>
                  <div ref={cardCcvRef} className="tpfield"></div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'PROCESSING...' : 'INITIATE PURCHASE'}
            </button>
          </form>

          <button onClick={() => navigate('/')} className="back-btn">
            ABORT MISSION
          </button>
        </div>
      </div>
    </div>
  );
}
