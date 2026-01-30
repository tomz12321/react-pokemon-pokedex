import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './reducers/pokemon';

const store = configureStore({
  reducer: {
    pokemon: pokemonReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
