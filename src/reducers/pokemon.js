const SET_POKEMON = 'pokedex/pokemon/SET_POKEMON';
const SET_ERROR = 'pokedex/pokemon/SET_ERROR';

const initialState = {
  pokemon: null,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_POKEMON:
      return {
        ...state,
        pokemon: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}

const setPokemon = (pokemon) => {
  return { type: SET_POKEMON, payload: pokemon };
};

const setError = (error) => {
  return { type: SET_ERROR, payload: error };
};

export const loadPokemon = (name, navigate) => {
  return (dispatch) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((response) => {
        if (!response.ok) throw new Error('Not found');
        return response.json();
      })
      .then((pokemon) => {
        dispatch(setPokemon(pokemon));
        if (navigate) navigate(`/pokemon/${name}`);
      })
      .catch((error) => {
        dispatch(setError(error.message || 'Error'));
        if (navigate) navigate('/not-found');
      });
  };
};
