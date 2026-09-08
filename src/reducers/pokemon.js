import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const normalizePokemonName = (name = '') => name.trim().toLowerCase();
const getEntry = (entries, name) => Object.hasOwn(entries, name) ? entries[name] : undefined;
const idleRequest = { status: 'idle', error: null };

export const fetchPokemon = createAsyncThunk(
  'pokemon/fetchPokemon',
  async (name, { rejectWithValue, signal }) => {
    const query = normalizePokemonName(name);
    const controller = new AbortController();
    const abort = () => controller.abort();
    const timeout = setTimeout(abort, 15000);
    signal.addEventListener('abort', abort, { once: true });

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      if (!response.ok) {
        return rejectWithValue({ kind: response.status === 404 ? 'not-found' : 'server' });
      }
      const data = await response.json();
      if (!data || typeof data.name !== 'string' || typeof data.id !== 'number') {
        return rejectWithValue({ kind: 'server' });
      }
      return data;
    } catch (error) {
      return rejectWithValue({
        kind: controller.signal.aborted ? 'timeout' : error instanceof SyntaxError ? 'server' : 'network'
      });
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener('abort', abort);
    }
  },
  {
    // StrictMode 與重複提交共用同一請求；已有資料時沿用快取。
    condition: (name, { getState }) => {
      const query = normalizePokemonName(name);
      const { byName, requestsByName } = getState().pokemon;
      return Boolean(query) && !getEntry(byName, query) &&
        getEntry(requestsByName, query)?.status !== 'loading';
    }
  }
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState: {
    byName: Object.create(null),
    requestsByName: Object.create(null)
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state, action) => {
        state.requestsByName[normalizePokemonName(action.meta.arg)] = {
          status: 'loading', error: null, requestId: action.meta.requestId
        };
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        const name = normalizePokemonName(action.meta.arg);
        const request = getEntry(state.requestsByName, name);
        if (request?.requestId !== action.meta.requestId) return;

        const pokemon = action.payload;
        state.byName[name] = pokemon;
        state.byName[pokemon.name] = pokemon;
        state.byName[String(pokemon.id)] = pokemon;
        request.status = 'succeeded';
        request.error = null;
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        const request = getEntry(state.requestsByName, normalizePokemonName(action.meta.arg));
        if (request?.requestId !== action.meta.requestId) return;

        request.status = action.meta.aborted ? 'idle' : 'failed';
        request.error = action.meta.aborted ? null : action.payload || { kind: 'network' };
      });
  }
});

export const selectPokemonByName = (name) => (state) =>
  getEntry(state.pokemon.byName, normalizePokemonName(name));

export const selectRequestByName = (name) => (state) =>
  getEntry(state.pokemon.requestsByName, normalizePokemonName(name)) || idleRequest;

export default pokemonSlice.reducer;
