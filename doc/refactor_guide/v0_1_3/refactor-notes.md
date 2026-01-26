# Project Plan: Pokemon Purchasing Agent & TapPay Integration

## 1. Overview

We aim to introduce a "Purchasing Agent" (委託收服) service to the Pokemon Pokedex app. This feature allows users to request Pokemon purchases from specific Pokemon Centers when ordering in bulk (10+ items). The payment will be handled securely via TapPay (Credit Card).

## 2. Service Scope

### 2.1 Supported Locations

- Pokemon Center Taipei (寶可夢中心 台北)
- Pokemon Center Okinawa (寶可夢中心 沖繩)
- Pokemon Center Fukuoka (寶可夢中心 福岡)
- Pokemon Center Tokyo Nihonbashi (寶可夢中心 東京日本橋)

### 2.2 Available Pokemon (Limited Selection)

- Pikachu
- Dragonite
- Lucario
- Garchomp

### 2.3 Business Logic

- **Quantity Threshold**: If the user orders **10 or more** of a specific Pokemon, a special message appears:
  > "Trainer tomz12321 will harvest them for you at the specified Pokemon Center!"
  > (只要代購數量達到十隻，訓練家 tomz12321 就會代替你前往該寶可夢中心收服，你指定的寶可夢喔！)

## 3. Technical Architecture Option

### Option A: Dedicated Page (Recommended)

- **Route**: `/purchasing-agent`
- **Navigation**: Add a "Buy / 代購" link in the main navigation or header.
- **Pros**:
  - Distinct URL to share.
  - Clean separation from the Pokedex browsing experience.
  - Full-page real estate for the payment form.

### Option B: Modal Integration

- **Trigger**: A "Buy" button on the card list.
- **Pros**: Contextual.
- **Cons**: Card payment forms can be crowded in modals; logic for "Purchasing Agent" implies a service request rather than a simple cart add.

**Decision**: We will proceed with **Option A** as requested ("有導頁連結可以連到這個頁面").

## 4. Implementation Plan

### Phase 1: Preparation

1.  **SDK Setup**: Add TapPay SDK script to `public/index.html` (or `index.html` in root for Vite).
2.  **Environment Variables**: Configure TapPay App ID and Key (Sandbox mode).

### Phase 2: React Components

1.  **PurchasingAgentPage**:
    - **Selection Form**: Dropdowns for Pokemon, Location, and Quantity input.
    - **Message Display**: Conditional rendering based on quantity >= 10.
    - **Payment Form (TapPay)**:
      - Card Number, Expiry, CCV (hosted fields).
      - "Pay Now" button.

2.  **Route Configuration**:
    - Add `<Route path="/purchasing-agent" element={<PurchasingAgentPage />} />` to `App.jsx`.
    - Add link in `App.jsx` navigation bar.

### Phase 3: TapPay Integration (Reference: `tappay-card` skill)

- Use `TPDirect.setupSDK` for initialization.
- Use `TPDirect.card.setup` for UI fields.
- Use `TPDirect.card.getPrime` to retrieve the prime token on form submission.
- **Real-time Rendering**: The payment form must support real-time rendering. When users select Pokemon, quantity, and location, the payment amount should be calculated and displayed immediately.
- **Card Number Masking**: When the card number field is rendered, mask digits 7-12 for security (e.g., display as `1234 56** **** 7890`).
- **Mock Backend**: Since we don't have a real backend, we will `console.log` the transaction details (Prime, Amount, Order Info) and show a success alert.

## 5. UI/UX Draft

- **Header**: "Pokemon Purchasing Agent Service"
- **Step 1: Order Details**
  - Select Pokemon (Select)
  - Select Center (Select)
  - Quantity (Number Input) -> _Triggers "tomz12321" message if >= 10_
- **Step 2: Payment**
  - Card Holder Info (Name, Email, Phone)
  - Credit Card Fields (TapPay Frames)
- **Footer**: Submit Button.
