import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk - 專注於資料抓取，不處理導頁
export const fetchPokemon = createAsyncThunk(
  'pokemon/fetchPokemon',
  async (name, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name.trim().toLowerCase()}`
      );
      if (!response.ok) {
        throw new Error('Not found');
      }
      const data = await response.json();
      return { name: name.trim().toLowerCase(), data };
    } catch (error) {
      return rejectWithValue({
        name: name.trim().toLowerCase(),
        message: error.message || 'Error fetching Pokemon'
      });
    }
  }
);

const initialState = {
  // 依名稱建立快取索引
  byName: {},
  // 當前查詢的名稱
  currentName: null,
  // 狀態: 'idle' | 'loading' | 'succeeded' | 'failed'
  status: 'idle',
  // 錯誤資訊
  error: null,
  // 失敗的查詢名稱（用於 PokemonNotFound）
  failedName: null
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    // 重置狀態
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.failedName = null;
    },
    // 清除錯誤
    clearError: (state) => {
      state.error = null;
      state.failedName = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state, action) => {
        state.status = 'loading';
        state.currentName = action.meta.arg.trim().toLowerCase();
        state.error = null;
        state.failedName = null;
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.byName[action.payload.name] = action.payload.data;
        state.currentName = action.payload.name;
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Unknown error';
        state.failedName = action.payload?.name || state.currentName;
      });
  }
});

export const { resetStatus, clearError } = pokemonSlice.actions;

// Selectors
export const selectCurrentPokemon = (state) => {
  const { currentName, byName } = state.pokemon;
  return currentName ? byName[currentName] : null;
};

export const selectPokemonByName = (name) => (state) => {
  return name ? state.pokemon.byName[name.toLowerCase()] : null;
};

export const selectStatus = (state) => state.pokemon.status;
export const selectError = (state) => state.pokemon.error;
export const selectFailedName = (state) => state.pokemon.failedName;
export const selectCurrentName = (state) => state.pokemon.currentName;

export default pokemonSlice.reducer;
