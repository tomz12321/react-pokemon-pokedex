# Pokedex 重構筆記

## 快速背景

- 小型 Vite + React + Redux 應用，查詢 PokeAPI 並導向 /pokemon/:name 或 /not-found。
- 單一 reducer 保存 `pokemon` 與 `error`，async thunk 同時負責抓取與導頁的副作用。

## 主要發現

- state 只存一個 `pokemon` 物件；若已有舊結果，切換新 `:pokemonName` 會跳過抓取，可能出現舊資料。
- 沒有 loading 旗標或重置舊資料/錯誤的流程；UI 無法呈現等待狀態，也可能顯示錯配內容。
- thunk 把資料抓取與路由耦合（在 thunk 內呼叫 `navigate`），關注點混雜、降低重用與測試性。
- 錯誤未被渲染；`/not-found` 視圖硬編碼顯示 "PIKACHU"，而非實際失敗的名稱。
- 沒有快取或重複請求防護；元件卸載後也缺乏 abort/cancel。
- store 仍用舊式 `createStore`/`applyMiddleware`；未使用 Redux Toolkit；devtools compose 只對全域有效。
- 元件簡陋且缺少 prop 型別與測試；CSS 多為 CRA 預設，未依路由/區塊分域。

## 重構建議（依優先順序）

1. **採用 Redux Toolkit：** 用 `configureStore` 取代手動 store；把 `loadPokemon` 改成 `createAsyncThunk`，處理 `pending/fulfilled/rejected` 以涵蓋 loading/error。
2. **改善 state 結構：** 依名稱建索引（例：`{ byName: { [name]: data }, currentName, status, error }`），切換名稱時可重用或重新抓取。
3. **解耦導頁：** 路由決策放在元件（如 `useEffect` 依 thunk 結果）或小型 side-effect hook；thunk 專注資料。
4. **呈現 loading/error 狀態：** 等待中顯示 spinner/skeleton；錯誤時顯示訊息與失敗名稱，而非固定 PIKACHU。
5. **輸入與請求衛生：** 輸入 trim+lowercase、阻擋空提交、loading 期間防抖或停用按鈕，並用 `AbortController` 取消過期請求。
6. **元件內聚：** `Pokemon` 透過 `pokemonName` 的 memoized selector 讀取資料，安全取得 sprite，處理缺圖情況；`PokemonNotFound` 轉為接收失敗名稱的純展示元件。
7. **樣式整理：** 移除 CRA 範本類名，使用區塊化樣式管理版面、卡片與提示狀態；確保表單響應式。
8. **測試：** 為 reducer/thunk（成功/錯誤）與元件（路由、loading、not-found）補單元測與元件測試。

## 下一步示例（小步快走）

- 切換至 RTK store 與 async thunk，加入 `status: 'idle'|'loading'|'succeeded'|'failed'` 與 `currentName`。
- `Pokemon` 在 `pokemonName` 變動或快取缺漏時觸發抓取，並對應渲染 loading/error。
- 失敗查詢透過 search params 或 location state 傳到 `/not-found`，並在 `PokemonNotFound` 顯示。
- 加入基本測試（Vitest/React Testing Library）涵蓋成功、404、導頁行為。
