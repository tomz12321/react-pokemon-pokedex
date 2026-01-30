# Pokedex 重構審查報告

**日期：** 2026 年 1 月 26 日  
**分支：** refactor-pokemon-pokedex-01-tomyang  
**依據：** `doc/refactor_guide/v0_1_1/refactor-notes.md`

---

## 📋 重構摘要

本次重構依據 v0.1.1 重構指南，將專案升級至現代化 React + Redux 最佳實踐，改善程式碼品質、可維護性與使用者體驗。

---

## 📁 改動檔案一覽

| 檔案路徑                             | 變更類型 | 說明                                   |
| ------------------------------------ | -------- | -------------------------------------- |
| `src/store.js`                       | 重構     | 升級至 Redux Toolkit                   |
| `src/reducers/pokemon.js`            | 重構     | 改用 createSlice + createAsyncThunk    |
| `src/components/Pokemon.jsx`         | 重構     | 使用 memoized selector，元件內處理導頁 |
| `src/components/PokemonNotFound.jsx` | 重構     | 顯示實際失敗的 Pokemon 名稱            |
| `src/App.jsx`                        | 重構     | 加入 loading 狀態與表單驗證            |
| `package.json`                       | 更新     | 新增 @reduxjs/toolkit 依賴             |

---

## ✅ 主要改進

### 1. 升級至 Redux Toolkit

**之前：** 使用舊式 `createStore` + `applyMiddleware` + 手動 action types

**之後：** 使用 `configureStore`，內建 DevTools 支援與 thunk middleware

```javascript
// store.js - 重構後
import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './reducers/pokemon';

const store = configureStore({
  reducer: {
    pokemon: pokemonReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});
```

---

### 2. 改善 State 結構

**之前：** 單一 `pokemon` 物件，無法處理快取與狀態追蹤

**之後：** 完整的狀態結構，包含快取、載入狀態、錯誤處理

```javascript
const initialState = {
  byName: {}, // 依名稱快取 Pokemon 資料
  currentName: null, // 當前查詢的名稱
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // 錯誤訊息
  failedName: null // 失敗的查詢名稱
};
```

---

### 3. 使用 createAsyncThunk 處理非同步邏輯

**之前：** 手動 thunk，在 thunk 內處理導頁（關注點混雜）

**之後：** 使用 `createAsyncThunk`，自動處理 `pending/fulfilled/rejected` 狀態

```javascript
export const fetchPokemon = createAsyncThunk(
  'pokemon/fetchPokemon',
  async (name, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!response.ok) throw new Error('Not found');
      return { name, data: await response.json() };
    } catch (error) {
      return rejectWithValue({ name, message: error.message });
    }
  }
);
```

---

### 4. 解耦導頁邏輯

**之前：** 在 thunk 內呼叫 `navigate()`，降低重用與測試性

**之後：** 導頁邏輯移至元件內，透過 `useEffect` 監聽狀態變化

```javascript
// App.jsx - 成功後導頁
useEffect(() => {
  if (status === 'succeeded' && currentName) {
    navigate(`/pokemon/${currentName}`);
  }
}, [status, currentName, navigate]);

// Pokemon.jsx - 失敗後導頁
useEffect(() => {
  if (status === 'failed' && failedName) {
    navigate(`/not-found?name=${encodeURIComponent(failedName)}`);
  }
}, [status, failedName, navigate]);
```

---

### 5. 使用 Memoized Selector

**之前：** 直接存取 `state.pokemon.pokemon`

**之後：** 使用 memoized selector 依名稱取得快取資料

```javascript
// reducers/pokemon.js
export const selectPokemonByName = (name) => (state) => {
  return name ? state.pokemon.byName[name.toLowerCase()] : null;
};

// Pokemon.jsx
const selectPokemon = useMemo(
  () => selectPokemonByName(pokemonName),
  [pokemonName]
);
const pokemon = useSelector(selectPokemon);
```

---

### 6. 改善 PokemonNotFound 元件

**之前：** 硬編碼顯示 "PIKACHU"

**之後：** 透過 URL search params 顯示實際失敗的名稱

```javascript
// PokemonNotFound.jsx
const [searchParams] = useSearchParams();
const failedName = searchParams.get('name') || 'Unknown';

// 顯示實際失敗的名稱
<h2>"{failedName}"</h2>;
```

---

### 7. 改善表單 UX

**之前：** 無 loading 回饋，可重複提交

**之後：**

- Loading 期間停用輸入框與按鈕
- 空白輸入阻擋提交
- 按鈕文字動態顯示狀態

```javascript
<button type='submit' disabled={isLoading || !name.trim()}>
  {isLoading ? 'SCANNING...' : 'SCAN'}
</button>
```

---

## 🎯 解決的問題

| 問題            | 解決方案                                   |
| --------------- | ------------------------------------------ |
| 舊資料殘留      | 依名稱建立快取索引，切換時正確取得對應資料 |
| 無 loading 狀態 | 加入 `status` 欄位，UI 可呈現等待狀態      |
| 導頁與資料耦合  | 分離關注點，thunk 專注資料，元件處理導頁   |
| 錯誤未正確顯示  | 透過 search params 傳遞失敗名稱            |
| 可重複提交      | loading 期間停用表單                       |
| 舊式 Redux 寫法 | 升級至 Redux Toolkit                       |

---

## 📦 新增依賴

```json
{
  "@reduxjs/toolkit": "^2.x.x"
}
```

---

## 🔮 後續建議

根據 v0.1.1 重構指南，後續可考慮：

1. **AbortController** - 取消過期請求
2. **測試覆蓋** - 為 reducer/thunk 與元件補上單元測試
3. **樣式整理** - 移除 CRA 範本類名，使用模組化樣式
4. **TypeScript** - 加入型別定義提升程式碼品質

---

## 📝 審查結論

本次重構成功將專案升級至現代化 React + Redux 最佳實踐，程式碼更加模組化、可測試、可維護。使用者體驗也獲得改善，包含 loading 狀態回饋與正確的錯誤訊息顯示。
