# 專案協作指南

本文件適用於整個專案，是 AI 開發代理共用的專案說明。`CLAUDE.md` 透過 `@AGENTS.md` 引入此文件；共用規則統一維護於此。

## 專案概況

- 寶可夢圖鑑單頁應用，使用 React 18、Vite 5、React Router 6、Redux Toolkit 2 與 React Redux。
- 程式碼為 JavaScript／JSX，樣式使用一般 CSS；目前未配置 TypeScript。
- 透過瀏覽器原生 `fetch` 呼叫 `https://pokeapi.co/api/v2/pokemon/{name}`，目前沒有專案自建後端或必要的環境變數。
- 主要介面採深色、紫色與霓虹色的科技風格。既有 UI 文案以英文為主；協作說明與文件預設使用繁體中文。

## 開發指令

在專案根目錄執行。工作目錄現有 `yarn.lock` 為 Yarn v1 格式，依賴操作優先沿用 Yarn。

| 指令 | 用途 |
| --- | --- |
| `yarn install` | 安裝依賴 |
| `yarn dev` | 啟動 Vite 開發伺服器；設定連接埠為 `5173`，並自動開啟瀏覽器 |
| `yarn build` | 建置正式版本，輸出至 `dist/` |
| `yarn preview` | 本機預覽已建置的 `dist/`；需先執行 build |
| `yarn start` | 目前執行 `npx vite preview`，用途同正式建置預覽 |
| `yarn test` | 僅輸出尚未配置測試工具的提示，不會執行測試 |

實際指令與建置設定以 `package.json`、`vite.config.js` 為準。`README.md` 仍是舊版 Create React App 範本，其中的開發模式 `yarn start`、`build/` 輸出目錄、測試與 `eject` 說明不適用於現況。目前也沒有可用的 lint script；`eslintConfig` 留有 `react-app` 設定，不代表已配置可執行的 lint 工具。

## 目前使用的檔案

| 路徑 | 職責 |
| --- | --- |
| `index.html` | Vite HTML 入口，載入 `/src/index.jsx` |
| `src/index.jsx` | 使用 `createRoot`，組合 StrictMode、Redux Provider 與 BrowserRouter；明確引入 `App.jsx` |
| `src/App.jsx` | 主版面、搜尋表單、路由，以及查詢成功後的導頁 |
| `src/store.js` | 使用 `configureStore` 註冊 `pokemon` reducer |
| `src/reducers/pokemon.js` | `fetchPokemon` thunk、slice、依名稱快取與 selectors |
| `src/components/Pokemon.jsx` | 依路由參數讀取／抓取資料、顯示詳細資訊與處理失敗導頁 |
| `src/components/PokemonNotFound.jsx` | 從 query string 讀取失敗名稱，提供返回首頁的操作 |
| `src/components/Welcome.jsx` | 首頁與 fallback 路由的歡迎畫面 |
| `src/App.css` | 主要主題、CSS 變數、動畫與響應式樣式 |
| `src/index.css` | 全域基礎樣式 |
| `public/` | 靜態資源 |
| `doc/refactor_guide/`、`doc/review/` | 歷史重構與審查紀錄，僅作背景參考 |

`src/index.js`、`src/App.js`、`src/App-old.jsx`、`src/App-old.css`、`src/components/Pokemon-old.jsx`、`src/components/*-futuristic.jsx` 與 `public/index.html` 未被目前入口使用。修改前追蹤實際 import，避免只改到備份版本；也不要因檔名含 `futuristic` 就認定它是現行元件。舊程式仍可能引用已移除的 `loadPokemon`，現行 thunk 為 `fetchPokemon`。除非任務涉及清理，毋須同步修改或刪除這些歷史檔案。

## 資料與路由慣例

- `/pokemon/:pokemonName` 顯示詳細資料；`/not-found?name=...` 顯示失敗名稱；其餘路由使用 `Welcome`。
- Redux 狀態位於 `state.pokemon`，包含 `byName`、`currentName`、`status`、`error`、`failedName`。`status` 使用 `idle`、`loading`、`succeeded`、`failed`。
- 查詢名稱在 thunk 中經 `trim().toLowerCase()` 正規化，並以正規化名稱作為快取 key。新增資料存取邏輯時保持名稱處理一致，優先沿用既有 selectors。
- 非同步資料抓取放在 thunk，導頁由元件透過 React Router 處理；不要將 `navigate` 傳入 thunk。
- 保留空白輸入驗證、載入期間停用表單、圖片缺漏 fallback，以及身高／體重除以 10 後顯示的單位轉換。
- 修改 effects、快取或導頁時，留意 StrictMode、失敗重試、過期回應與連續查詢，避免重複請求或導頁循環。現有程式不代表已完整處理所有邊界情況。

## 修改慣例

- 採用函式元件與 hooks，沿用目前 ES modules、兩格縮排、單引號與分號風格；JSX 元件使用 `.jsx`。
- 讓變更集中於任務需要的範圍，保留使用者既有修改。不要順帶全面格式化、升級依賴或遷移框架。
- 樣式優先沿用 `src/App.css` 的 CSS 變數與既有 class。新增可重用樣式時集中於 CSS，並維持手機版、鍵盤操作與 `prefers-reduced-motion` 支援。
- 若需要改動依賴，同步檢查 `package.json` 與 lockfile，避免混用套件管理工具或手動修改產生的 lockfile。
- 當任務改變開發指令、入口或架構時，同步更新本文件。歷史重構文件中的建議與審查結論，需對照現有程式碼確認。

## 驗證與交付

- 修改程式、樣式或建置設定後執行 `yarn build`。純文件修改檢查內容、路徑、引用與 `git diff --check` 即可。
- `yarn test` 成功結束不能當作測試通過。目前未配置自動化測試；依任務需要選擇驗證方式，若新增測試工具，必須同步提供真正可執行的 script。
- 涉及搜尋、狀態或路由時，手動檢查有效名稱（例如 `pikachu`）、大小寫與前後空白、空白提交、不存在的名稱、請求失敗、載入狀態、失敗後重試及連續查詢不同名稱。
- 檢查直接開啟／重新整理 `/pokemon/pikachu`、瀏覽器上一頁／下一頁，以及從首頁與詳情頁發起失敗查詢。涉及 UI 時另外檢查窄螢幕、捲動與圖片缺漏情境。
- API、寶可夢圖片與 Google Fonts 需要網路；遇到環境限制時如實記錄未能完成的驗證。
- 完成前檢查 diff，確保沒有意外納入 `dist/`、`node_modules/` 或其他產物。交付說明應列出實際修改、已執行的驗證與仍存在的限制。
