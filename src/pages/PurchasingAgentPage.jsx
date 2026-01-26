import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  // Get current pokemon from Redux to pre-fill
  const currentReduxPokemon = useSelector((state) => state.pokemon.pokemon);

  const [pokemon, setPokemon] = useState(() => {
    if (currentReduxPokemon && currentReduxPokemon.name) {
      const match = POKEMON_OPTIONS.find(opt => opt.value === currentReduxPokemon.name.toLowerCase());
      if (match) return match.value;
    }
    return POKEMON_OPTIONS[0].value;
  });

  const [location, setLocation] = useState(LOCATION_OPTIONS[0].value);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock Payment State
  const [mockCardInfo, setMockCardInfo] = useState({
    number: '',
    expiry: '',
    ccv: ''
  });

  // Payment form refs (Unused in Mock Mode but kept for structure if needed)
  const cardNumberRef = useRef(null);
  const cardExpirationRef = useRef(null);
  const cardCcvRef = useRef(null);

  const isEligibleForAgent = quantity >= 10;

  // Mock Mode: Disable TapPay SDK initialization
  /*
  useEffect(() => {
    let intervalId;

    const initTapPay = () => {
      if (window.TPDirect && cardNumberRef.current && cardExpirationRef.current && cardCcvRef.current) {
        try {
          window.TPDirect.setupSDK(
            12348, // Sandbox App ID
            'app_key_12348',
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
          return true;
        } catch (e) {
          console.error("TapPay init failed", e);
          return false;
        }
      }
      return false;
    };

    if (!initTapPay()) {
      intervalId = setInterval(() => {
        if (initTapPay()) {
          clearInterval(intervalId);
        }
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
  */

  // Real values for sensitive fields (Stored in refs to avoid re-renders or losing data on mask)
  const realCardNumberRef = useRef('');

  const maskCardNumber = (value) => {
    // Digits 7-12 are index 6-11
    return value.split('').map((char, index) => {
      if (index >= 6 && index <= 11) return '*';
      return char;
    }).join('');
  };

  const handleCardNumberChange = (e) => {
    const newVal = e.target.value;
    const oldVal = mockCardInfo.number;

    // Simple logic: Assume changes happen at the end (typing or backspace)
    // For a robust implementation, we'd need cursor position diffing
    if (newVal.length > oldVal.length) {
      // Added characters
      const added = newVal.slice(oldVal.length);
      realCardNumberRef.current += added;
    } else if (newVal.length < oldVal.length) {
      // Removed characters (from end)
      const removedCount = oldVal.length - newVal.length;
      realCardNumberRef.current = realCardNumberRef.current.slice(0, -removedCount);
    }

    // Update state with masked version
    setMockCardInfo({
      ...mockCardInfo,
      number: maskCardNumber(realCardNumberRef.current)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock Mode: Simulate API call and log values
    console.log('[MOCK MODE] Submitting Order and Payment Details...');
    console.log('Order Details:', { pokemon, location, quantity });

    // Use Real Number for log/alert
    const paymentDetails = {
      ...mockCardInfo,
      number: realCardNumberRef.current // Log the REAL number to prove we have it
    };
    console.log('Payment Details (Mock):', paymentDetails);

    setTimeout(() => {
      setLoading(false);
      alert(`[MOCK MODE] Order Placed!\n\nSpecs:\nPokemon: ${pokemon}\nLocation: ${location}\nQuantity: ${quantity}\n\nPayment:\nCard: ${paymentDetails.number} (Masked in UI: ${mockCardInfo.number})\nExpires: ${mockCardInfo.expiry}\nCCV: ${mockCardInfo.ccv}\n\n${isEligibleForAgent ? 'Trainer tomz12321 is on the case!' : 'Standard shipping applied.'}`);
      navigate('/');
    }, 1000);

    /* Original TapPay Submit Logic (Disabled)
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
    */
  };

  return (
    <div className="purchasing-agent-page">
      <div className="center">
        <div className="pokedex">
          <div className="pokedex-header">
            <h1 className="pokedex-title">委託收服</h1>
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
              <h3 className="section-title">Credit Authorization (MOCK MODE)</h3>

              <div className="form-group">
                <label>Card Number</label>
                {/* <div ref={cardNumberRef} className="tpfield"></div> */}
                <input
                  type="text"
                  className="tpfield"
                  placeholder="0000 0000 0000 0000"
                  value={mockCardInfo.number}
                  onChange={handleCardNumberChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry</label>
                  {/* <div ref={cardExpirationRef} className="tpfield"></div> */}
                  <input
                    type="text"
                    className="tpfield"
                    placeholder="MM/YY"
                    value={mockCardInfo.expiry}
                    onChange={(e) => setMockCardInfo({ ...mockCardInfo, expiry: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>CCV</label>
                  {/* <div ref={cardCcvRef} className="tpfield"></div> */}
                  <input
                    type="text"
                    className="tpfield"
                    placeholder="123"
                    value={mockCardInfo.ccv}
                    onChange={(e) => setMockCardInfo({ ...mockCardInfo, ccv: e.target.value })}
                  />
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
