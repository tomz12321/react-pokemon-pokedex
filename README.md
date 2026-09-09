# Pokédex · v0.2.0

以 React 18、Vite、React Router 與 Redux Toolkit 建立的寶可夢圖鑑。輸入英文名稱或圖鑑編號，查看圖片、屬性、能力值、身高、體重與特性。

## 本機開發

使用 Node.js 22 或以上與 Yarn Classic（1.x）。

```sh
yarn install --frozen-lockfile
yarn dev
```

開發伺服器預設使用 `http://localhost:5173`，並自動開啟瀏覽器。資料來自 [PokéAPI](https://pokeapi.co/)，圖片與字體亦需要網路；不需要 API key 或環境變數。

## 指令

| 指令 | 用途 |
| --- | --- |
| `yarn dev` | 啟動 Vite 開發伺服器 |
| `yarn test` | 執行 Node.js 內建 test runner 的請求與快取回歸測試 |
| `yarn build` | 建置正式版本至 `dist/` |
| `yarn preview` | 預覽已建置的正式版本 |
| `yarn start` | 執行 `npx vite preview`；需先建置 |

部署靜態網站時，需將前端路由回退至根目錄的 `index.html`，以支援直接開啟或重新整理 `/pokemon/pikachu` 等網址。

## 瀏覽器相容性資料維護

`yarn.lock` 納入版本控制，固定團隊與部署環境使用的依賴版本。初次安裝或拉取更新後，執行 `yarn install --frozen-lockfile`。

若出現 `Browserslist: browsers data (caniuse-lite) is ... old`，在專案根目錄執行：

```sh
npx --yes update-browserslist-db@latest
```

[官方更新工具](https://github.com/browserslist/update-db#readme) 會偵測 `yarn.lock`，透過 Yarn 更新瀏覽器資料；這裡的 `npx` 僅用於執行工具，依賴安裝仍使用 Yarn。

若仍出現 `[baseline-browser-mapping] The data in this module is over two months old`，Yarn Classic 可能保留了舊的間接依賴。使用 `yarn.lock` 中目前的相依範圍更新，再移除暫時新增的直接依賴：

```sh
yarn upgrade 'baseline-browser-mapping@^2.8.3'
yarn remove baseline-browser-mapping
```

`^2.8.3` 對應目前 Browserslist 的相依範圍；日後若升級 Browserslist，需先核對 `yarn.lock` 的 `baseline-browser-mapping@...` 條目。更新後執行 `yarn browserslist` 與 `yarn build`，確認兩則資料過期警告已消失，並提交 `yarn.lock`。資料會隨時間過期，之後出現警告時需再次更新；不要以忽略警告的環境變數取代更新。

## v0.2.0 的改善

- 搜尋列位於結果上方，使用單一頁面捲動，手機版不再產生整個螢幕高度的多餘空白。
- 首頁提供可點選的寶可夢範例、清楚的欄位標籤與輸入說明。
- 依網址呈現載入、資料或錯誤，支援重新整理、上一頁與下一頁。
- 分開處理查無資料、網路失敗、服務異常與 15 秒逾時；重試會重新請求，修改搜尋會選取原輸入。
- 依名稱與編號共用快取，避免 StrictMode 重複請求及遲到回應影響其他查詢。
- 官方插畫失敗時降級至 sprite，再降級至文字 placeholder。
- 詳情頁使用屬性識別色與能力值橫條。橫條尺度會顯示於畫面，取該寶可夢最高能力值與 100 的較大值。
- 保留深色與紫色主題，減少常駐動畫，加入鍵盤焦點、狀態通知及減少動態效果支援。
- 頁尾版本直接引用 `package.json`。

## 驗證

`yarn test` 使用模擬 HTTP 回應，不依賴線上 API，涵蓋快取、重複請求、錯誤分類、重試、逾時與取消。它不包含瀏覽器視覺或輔助科技驗證。

修改互動後，另外檢查首頁範例、空白輸入、大小寫與空白正規化、名稱／編號查詢、錯誤後修改及重試、直接開啟網址、重新整理與歷史導覽。UI 檢查至少涵蓋 320px、390px、768px 與桌機寬度，並確認沒有水平溢出或巢狀捲動。

共用的開發代理指南見 [AGENTS.md](AGENTS.md)；[CLAUDE.md](CLAUDE.md) 透過 `@AGENTS.md` 引入。
